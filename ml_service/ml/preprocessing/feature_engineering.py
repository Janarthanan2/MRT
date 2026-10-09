import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import os

def preprocess_features(file_path):
    df = pd.read_csv(file_path)
    
    # Combine Item Name and Short Name as primary features
    # We fill NaNs to avoid issues with concatenation
    df['combined_features'] = df['Item Name'].fillna('') + " " + df['Short Name'].fillna('')
    
    # Remove rows with no features
    df = df[df['combined_features'].str.strip() != '']
    
    # Label encoding for HSN Code (the categories)
    le = LabelEncoder()
    df['hsn_label'] = le.fit_transform(df['HSN Code'])
    
    # Save partial processed data
    df.to_csv("ml/data/processed_data.csv", index=False)
    print(f"Processed data saved. Shape: {df.shape}")
    return df, le

if __name__ == "__main__":
    path = "ml/data/cleaned_data.csv"
    df_processed, le = preprocess_features(path)
    print(f"Unique Categories: {le.classes_}")
