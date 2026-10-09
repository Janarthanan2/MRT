import pandas as pd
import numpy as np
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def preprocess_data(input_path, output_path):
    # Use header=2 as determined from previous inspection
    df = pd.read_excel(input_path, engine='xlrd', header=2)
    
    # Drop rows where target or main features are null
    initial_count = len(df)
    df = df.dropna(subset=['Item Name', 'HSN Code'])
    df = df.dropna(subset=['Short Name'])
    
    # Keep only relevant columns
    # We use Item Name, Short Name as features and HSN Code as target
    df = df[['Item Name', 'Short Name', 'HSN Code']].copy()
    
    # Standardize HSN Code to string and handle potential floats
    df['HSN Code'] = df['HSN Code'].astype(str).str.replace(r'\.0$', '', regex=True)
    
    # Remove duplicates based on Item Name
    df = df.drop_duplicates(subset=['Item Name'])
    
    final_count = len(df)
    logging.info(f"Filtered {initial_count - final_count} rows. Remaining rows: {final_count}")
    
    # Save cleaned data
    df.to_csv(output_path, index=False)
    logging.info(f"Saved cleaned data to {output_path}")
    return df

if __name__ == "__main__":
    input_file = r"C:\Users\JANARTHANAN\OneDrive\Documents\AI Projects\AI\projects\13081_Item_maste_tem_master_6286_2026_10_04_112527.xls"
    output_file = "ml/data/cleaned_data.csv"
    
    os.makedirs("ml/data", exist_ok=True)
    
    df_cleaned = preprocess_data(input_file, output_file)
    print(f"Sample of cleaned data:\n{df_cleaned.head()}")
