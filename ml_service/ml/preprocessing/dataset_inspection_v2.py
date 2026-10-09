import pandas as pd
import numpy as np
import os

def find_true_data(file_path):
    # Load the Excel file with no header to see everything
    df_raw = pd.read_excel(file_path, engine='xlrd', header=None)
    
    # Look for the row where "Item code" or "Item Name" appears
    header_row_idx = -1
    for i, row in df_raw.iterrows():
        if "Item code" in row.values or "Item Name" in row.values:
            header_row_idx = i
            break
    
    if header_row_idx == -1:
        print("Could not find header row automatically.")
        return
    
    df = df_raw.iloc[header_row_idx:].copy()
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)
    df.columns = [str(c).strip() for c in df.columns]
    
    # Drop completely empty rows
    df = df.dropna(how='all')
    
    print(f"Found header at row: {header_row_idx}")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")
    print("\nActual Column Names:")
    print(df.columns.tolist())
    
    # Print variance for all columns that might be categories
    potential_cats = ['Major Category', 'Product Type', 'Item Product Type', 'Item Type', 'Generic Name']
    print("\nColumn Variety Analysis:")
    for col in df.columns:
        # If column is likely a category (not an ID, and has some variance)
        if col in potential_cats or df[col].nunique() > 1:
            unique_count = df[col].nunique()
            null_count = df[col].isnull().sum()
            print(f"{col}: Unique={unique_count}, Nulls={null_count}, Top Value={df[col].mode()[0] if not df[col].mode().empty else 'N/A'}")

    # Detect Class Imbalance for potential target columns
    for col in potential_cats:
        if col in df.columns:
            print(f"\n--- {col} Distribution ---")
            counts = df[col].value_counts().sort_index()
            print(counts)

if __name__ == "__main__":
    file_path = r"C:\Users\JANARTHANAN\OneDrive\Documents\AI Projects\AI\projects\13081_Item_maste_tem_master_6286_2026_10_04_112527.xls"
    find_true_data(file_path)
