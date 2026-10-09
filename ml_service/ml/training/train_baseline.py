import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
import os

def train_baseline_model(data_path, model_path, vectorizer_path, encoder_path):
    df = pd.read_csv(data_path)
    
    # Filter out classes with fewer than 2 members to allow stratification
    counts = df['hsn_label'].value_counts()
    df = df[df['hsn_label'].isin(counts[counts > 1].index)].copy()
    
    X = df['combined_features']
    y = df['hsn_label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=10000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # Train Logistic Regression
    model = LogisticRegression(multi_class='multinomial', max_iter=1000, C=1.0)
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_tfidf)
    print(f"Macro F1-score: {f1_score(y_test, y_pred, average='macro')}")
    print(classification_report(y_test, y_pred))
    
    # Save objects
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    # We need to save the encoder mapping as well
    # Re-fitting on the filtered df to ensure consistency
    from sklearn.preprocessing import LabelEncoder
    le = LabelEncoder()
    # Extract original HSN codes from the filtered dataframe
    # We need to find the original HSN codes associated with the labels
    # Since we did 'df = df[df['hsn_label'].isin(counts[counts > 1].index)]' earlier, 
    # we can just use the current df.
    # Let's re-save the encoder correctly.
    # Actually, it's better to save the mapping from labels to HSN codes.
    
    # A simple way is to save a dictionary
    # Let's get the unique hsn_label and corresponding HSN Code
    label_map = df.groupby('hsn_label')['HSN Code'].first().to_dict()
    joblib.dump(label_map, encoder_path)
    
    print("Model, Vectorizer, and Label Mapping saved successfully.")

if __name__ == "__main__":
    data_path = "ml/data/processed_data.csv"
    model_path = "ml/models/baseline_model.pkl"
    vectorizer_path = "ml/models/vectorizer.pkl"
    encoder_path = "ml/models/label_map.pkl"
    
    os.makedirs("ml/models", exist_ok=True)
    
    train_baseline_model(data_path, model_path, vectorizer_path, encoder_path)
