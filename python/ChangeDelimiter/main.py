import csv
def change_delimiter(input_file, output_file, old_delimiter=',', new_delimiter=';'):
    with open(input_file, 'r', newline='', encoding='utf-8') as infile, \
            open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile, delimiter=old_delimiter)
        writer = csv.writer(outfile, delimiter=new_delimiter)
        for row in reader:
            writer.writerow(row)
input_csv_file = r"C:\Users\serge\Oleksii\projects\car-market\car_market\back-end\src\main\resources\vehicle_dataset.csv"  # Path to the input CSV file
output_csv_file = r"C:\Users\serge\Oleksii\projects\car-market\car_market\back-end\src\main\resources\vehicle_dataset2.csv"  # Path to the output CSV file with changed delimiter
change_delimiter(input_csv_file, output_csv_file, old_delimiter=',', new_delimiter=';')
