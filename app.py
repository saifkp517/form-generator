import pdfplumber
import re
import json


path = r"C:\Users\saifk\Downloads\BuildersRisk.pdf"

def extract_text_from_pdf(pdf_path):

    extracted_text = []
    valid_tables = []
    current_table = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:

            page_text = page.extract_text()
            tables = page.extract_tables()

            if tables:
                for table in tables:
                    for row in table:
                        if any(cell.strip() for cell in row):
                            current_table.append(row)
                        else:
                            if current_table:
                                valid_tables.append(current_table)
                                current_table = []
                        row_text = " ".join(filter(None, row))
                        page_text = page_text.replace(row_text, "")


            for idx, table in enumerate(valid_tables, 1):
                print(f"Table {idx}: {table}: ")
                print()
            if page_text:
                extracted_text.append(page_text)

    return "\n".join(extracted_text)


def categorize_fields(field):
    if re.search(r"\b(From:|To:|Dates:|date)\b", field):
        return "dates"
    if re.search(r"\b(Address|Location)\b", field):
        return "addresses"
    if re.search(r"\b(Yes\s*No)\b", field):
        return "radio_buttons"
    if re.search(r"\[\s*\]", field):
        return "checkboxes"

    return "single_line"

def parse_form(text):

    categorized_fields = {
        "dates": [],
        "addresses": [],
        "radio_buttons": [],
        "checkboxes": [],
        "single_line": []
    }

    pattern = r"^(\d+\..*?|[a-zA-Z]\).*?)$"

    lines = text.split("\n")
    fields = []
    current_field = ""

    for line in lines:
        match = re.match(pattern, line.strip())

        if match:
            if current_field:
                fields.append(current_field)
            current_field = match.group(1).strip()
        elif current_field:
            current_field += " " + line.strip()

    if current_field: # append last field
        fields.append(current_field)

    for field in fields:
        category = categorize_fields(field)
        categorized_fields[category].append(field)
    
    return categorized_fields



# Extract text
clean_text = extract_text_from_pdf(path)

# Parse form fields
parsed_fields = parse_form(clean_text)

# Print extracted variables
pretty_json = json.dumps(parsed_fields, indent=4)

# Print the pretty JSON string
# print(pretty_json)
