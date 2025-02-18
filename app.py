import pdfplumber
import re
import json



path = r"C:\Users\saifk\Downloads\BuildersRisk.pdf"

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

parsed_fields = []

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
        parsed_fields.append(f"{field}({category})")
        # categorized_fields[category].append(field)
    
    # return categorized_fields


def extract_text_from_pdf(pdf_path):

    document_content = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            elements = []
            
            # Extract tables first
            tables = page.extract_tables()
            
            # Process tables
            if tables:
                for table in tables:
                    formatted_rows = []
                    for row in table:
                        # Filter out None/empty cells and strip whitespace
                        cleaned_row = [str(cell).strip() if cell else '' for cell in row]
                        if any(cleaned_row):  # Only include rows with content
                            formatted_row = ' '.join(cell for cell in cleaned_row if cell)
                            if formatted_row:  # Only add non-empty rows
                                formatted_rows.append(formatted_row)
                    if formatted_rows:
                        table_text = '\n'.join(formatted_rows)
                        elements.append((0, "start-------------------------------------------------Table---------------------------------------------------------------------")) 
                        elements.append((0, table_text))  # Use 0 as y-position for tables
                        elements.append((0, "end-------------------------------------------------Table---------------------------------------------------------------------")) 
            
            # Extract and process regular text
            text = page.extract_text()
            if text:
                # Remove table content from text to avoid duplication
                for element in elements:
                    text = text.replace(element[1], '')
                
                # Split remaining text into lines and add to elements
                for line in text.split('\n'):
                    if line.strip():  # Only add non-empty lines
                        elements.append((1, line.strip()))  # Use 1 as y-position for text
            
            # Add all elements to document content
            document_content.extend(element[1] for element in elements)
    
    return '\n'.join(filter(None, document_content))


# Extract text
clean_text = extract_text_from_pdf(path)

# Parse form fields
parse_form(clean_text)

# Print extracted variables
pretty_json = json.dumps(parsed_fields, indent=4)

# Print the pretty JSON string
print(clean_text)
