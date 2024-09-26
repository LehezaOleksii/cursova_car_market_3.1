import pandas as pd
csv_file_path = r'C:\Users\serge\Oleksii\projects\car-market\car_market\back-end\src\main\resources\vehicle_dataset.csv'
df = pd.read_csv(csv_file_path, on_bad_lines='skip', sep=";", quoting=3)
column_to_check = 'engine_specs_title'
df[column_to_check] = df[column_to_check].apply(lambda x: x[:254] if isinstance(x, str) and len(x) > 255 else x)
output_csv_path = r'C:\Users\serge\Oleksii\projects\car-market\car_market\back-end\src\main\resources\vehicle_dataset2.csv'
df.to_csv(output_csv_path, index=False, sep=";")
print("CSV has been processed and saved to:", output_csv_path)
