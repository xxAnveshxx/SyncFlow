from fastapi import FastAPI, HTTPException, Query # pyright: ignore[reportMissingImports]
from elasticsearch import Elasticsearch # pyright: ignore[reportMissingImports]
from typing import Optional

app = FastAPI(title="SyncFlow API", version="1.0.0")

ES_HOST = "http://elasticsearch:9200"
es = Elasticsearch([ES_HOST])

@app.get("/health")
def health_check():
    return{"status":"healthy","elasticsearch":es.ping()}

@app.get("/users")
def get_users():
    result = es.search(index="users", body={"query": {"match_all": {}}}, size=100)
    return {"users": [hit["_source"] for hit in result["hits"]["hits"]]}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    try:
        result = es.get(index="users", id=user_id)
        return result["_source"]
    except:
        raise HTTPException(status_code=404, detail="User not found")
    
@app.get("/users/search/")
def search_users(q:str = Query(..., description="search query")):
    result = es.search(index="users", body = {
        "query": {
            "multi_match": {
                "query": q,
                "fields": ["name","email"]
            }
        }
    })
    return {"users": [hit["_source"] for hit in result["hits"]["hits"]]}

@app.get("/products")
def get_products():
    result = es.search(index="products", body={"query": {"match_all":{}}},size=100)
    return {"products": [hit["_source"] for hit in result["hits"]["hits"]]}

@app.get("/products/{product_id}")
def get_product(product_id: int):
    try:
        result = es.get(index="products", id=product_id)
        return result["_source"]
    except:
        raise HTTPException(status_code=404, detail="Product not found")

@app.get("/products/search/")
def search_products(q: str = Query(..., description="Search query")):
    result = es.search(index="products", body = {
        "query": {
            "multi_match": {
                "query" : q,
                "fields": ["name","description","category"]
            }
        }
    })
    return {"products": [hit["_source"] for hit in result["hits"]["hits"]]}

@app.get("/orders")
def get_orders():
    result = es.search(index="orders", body={"query": {"match_all": {}}}, size=100)
    return {"orders": [hit["_source"] for hit in result["hits"]["hits"]]}

@app.get("/orders/{orders_id}")
def get_order(order_id: int):
    try:
        result = es.get(index="orders", id=order_id)
        return result["_source"]
    except:
        raise HTTPException(status_code=404, detail="Order not found")