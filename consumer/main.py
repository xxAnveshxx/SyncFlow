import json
from confluent_kafka import Consumer, KafkaError # pyright: ignore[reportMissingImports]
from elasticsearch import Elasticsearch # pyright: ignore[reportMissingImports]

KAFKA_BOOTSTRAP_SERVERS = "kafka:29092"
KAFKA_TOPICS = [
    "syncflow.public.users",
    "syncflow.public.products",
    "syncflow.public.orders"
]

ES_HOST = "http://elasticsearch:9200"

def create_consumer():
    config = {
        "bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS,
        "group.id": "syncflow-consumer",
        "auto.offset.reset": "earliest"
    }
    consumer = Consumer(config)
    consumer.subscribe(KAFKA_TOPICS)
    return consumer

def create_es_client():
    return Elasticsearch([ES_HOST])

def get_index_name(topic):
    return topic.split(".")[-1]

def process_message(msg, es):
    topic = msg.topic()
    index_name = get_index_name(topic)
    try:
        value = json.loads(msg.value().decode("utf-8"))
    except:
        print(f"Failed to parse message: {msg.value()}")
        return

    payload = value.get("payload", value)
    operation = payload.get("op")

    if operation == "c" or operation == "r":
        doc = payload.get("after")
        if doc:
            doc_id = doc.get("id")
            es.index(index=index_name, id=doc_id, document=doc)
            print(f"INDEXED: {index_name}/{doc_id}")

    elif operation == "u":
        doc = payload.get("after")
        if doc:
            doc_id = doc.get("id")
            es.index(index=index_name, id=doc_id, document=doc)
            print(f"UPDATED: {index_name}/{doc_id}")
    
    elif operation == "d":
        doc = payload.get("before")
        if doc:
            doc_id = doc.get("id")
            es.delete(index=index_name, id=doc_id, ignore=[404])
            print(f"DELETED: {index_name}/{doc_id}")
        
def main():
    print("STARTING TS")

    consumer = create_consumer()
    es = create_es_client()

    print(f"Connected to Kafka: {KAFKA_BOOTSTRAP_SERVERS}")
    print(f"Connected to Elasticsearch: {ES_HOST}")
    print(f"Subscribed to: {KAFKA_TOPICS}")  

    try:
        while True:
            msg = consumer.poll(1.0)
            
            if msg is None:
                continue
            
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                print(f"Consumer error: {msg.error()}")
                continue
            
            process_message(msg, es)
    
    except KeyboardInterrupt:
        print("SHUTDOWN")
    finally:
        consumer.close()


if __name__ == "__main__":
    main()