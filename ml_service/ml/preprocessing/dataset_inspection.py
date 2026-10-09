import pandas as pd
import numpy as np
import os
import sys

def inspect_dataset(file_path):
    try:
        # Load the Excel file. 
        # We use header=None first to see everything, then try to find the header row.
        df_raw = pd.read_excel(file_path, engine='xlrd', header=None)
        
        # Heuristic: Find the first row that has more than a certain percentage of non-null values
        # and seems to contain the actual headers.
        header_row_idx = 0
        max_non_null = 0
        for i in range(len(df_raw)):
            non_null_count = df_raw.iloc[i].notnull().sum()
            if non_null_count > max_non_null:
                max_non_null = non_null_count
                header_row_idx = i
        
        df = df_raw.iloc[header_row_idx:].copy()
        df.columns = df.iloc[0]
        df = df[1:].reset_index(drop=True)
        
        # Clean up column names
        df.columns = [str(c).strip() for c in df.columns]

        print(f"File: {os.path.basename(file_path)}")
        print(f"Rows: {df.shape[0]}")
        print(f"Columns: {df.shape[1]}")
        print("\nActual Column Names:")
        print(df.columns.tolist())
        
        print("\nData Types:")
        print(df.dtypes)
        
        print("\nMissing Values:")
        print(df.isnull().sum())
        
        print("\nDuplicate Rows:")
        print(df.duplicated().sum())

        print("\nNumber of Unique Values per Column:")
        for col in df.columns:
            print(f"{col}: {df[col].nunique()}")

        potential_categories = ['Major Category', 'Product Type', 'Item Product Type', 'Item Type', 'Generic Name']
        print("\nCategory Distribution for potential columns:")
        for col in potential_categories:
            if col in df.columns:
                print(f"\n--- {col} ---")
                print(df[col].value_counts().head(20))
            else:
                print(f"\n--- {col} --- Not found in dataset.")

        empty_cols = df.columns[df.isnull().all()].tolist()
        mostly_empty_cols = df.columns[df.isnull().mean() > 0.8].tolist()
        
        print("\nData Quality Report:")
        print(f"Completely Empty Columns: {empty_cols}")
        print(f"Mostly Empty Columns: {mostly_empty_cols}")
        
        identifiers = []
        # Check for high cardinality columns
        for col in df.columns:
            if df[col].nunique() > (len(df) * 0.9) and df[col].notnull().sum() > 0:
                identifiers.append(col)
        print(f"Potential Identifier Columns: {identifiers}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Use absolute path provided by user
    file_path = r"C:\Users\JANARTHANAN\OneDrive\Documents\AI Projects\AI\projects\13081_Item_maste_tem_master_6286_2026_10_04_112527.xls"
    inspect_dataset(file_path)
