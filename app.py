import pdfplumber
import re
import json




path = r"C:\Users\saifk\Downloads\BuildersRisk.pdf"

def parse_document(document_content):
    lines = document_content.strip().split("\n")
    fields = []
    table_name = None
    inside_table = False
    
    for line in lines:
        line = line.strip()
        
        if "start-------------------------------------------------Table" in line:
            inside_table = True
            continue
        
        if "end-------------------------------------------------Table" in line:
            inside_table = False
            continue
        
        match = re.match(r"(.*?)\s*:=\s*(\w+)", line)
        if match:
            field_name, field_type = match.groups()
            
            if inside_table and not table_name:
                table_name = field_name
            else:
                fields.append({"field_name": field_name.strip(":Field_Type"), "type": field_type.strip()})
    
    if table_name:
        fields.append({"field_name": table_name, "type": "table"})
    
    return fields

def categorize_fields(field):
    """
    Categorize form fields based on their content and structure.
    
    This function analyzes the field text using regex patterns to determine
    the most appropriate input type for form building.
    
    Args:
        field (str): The field label or description text
        
    Returns:
        str: The category of the field (e.g., 'date', 'email', 'dropdown', etc.)
    """
    # Normalize the field text for consistent matching
    normalized_field = field.strip().lower()
    
    # Date fields (various formats and keywords)
    if (re.search(r"\b(from:|to:|dates?:|date\s+range|start\s+date|end\s+date|period|when|calendar|schedule)\b", 
                 normalized_field, re.IGNORECASE) or 
        re.search(r"\b(dd/mm/yyyy|mm/dd/yyyy|yyyy-mm-dd)\b", normalized_field, re.IGNORECASE)):
        return "date"
    
    # Time fields
    if re.search(r"\b(time|hours?|minutes?|duration|from\s+time|to\s+time|schedule\s+time|appointment\s+time)\b", 
                normalized_field, re.IGNORECASE):
        return "time"
    
    # Email fields
    if re.search(r"\b(email|e-mail|mail\s+address|email\s+address|e-mail\s+id)\b", 
                normalized_field, re.IGNORECASE) or '@' in normalized_field:
        return "email"
    
    # Phone number fields
    if re.search(r"\b(phone|telephone|mobile|cell|contact\s+number|phone\s+number|tel)\b", 
                normalized_field, re.IGNORECASE):
        return "phone"
    
    # Address fields (more comprehensive matching)
    if (re.search(r"\b(address|location|street|city|state|zip|postal\s+code|country|province|territory|residence)\b", 
                 normalized_field, re.IGNORECASE) and 
        not re.search(r"\b(email|e-mail|website|url)\b", normalized_field, re.IGNORECASE)):
        return "address"
    
    # URL/Website fields
    if re.search(r"\b(website|url|web\s+address|homepage|domain|site)\b", 
                normalized_field, re.IGNORECASE):
        return "url"
    
    # Numeric fields (including currency)
    if re.search(r"\b(number|amount|quantity|count|age|years|price|cost|fee|salary|budget|total)\b", 
                normalized_field, re.IGNORECASE) or re.search(r"[$€£¥]", normalized_field):
        return "number"
    
    # Multiple choice options - Radio buttons (Yes/No or limited choices)
    if (re.search(r"\b(yes[/\s\-]*no|true[/\s\-]*false|choose\s+one|select\s+one|pick\s+one|gender|sex|male[/\s\-]*female)\b", 
                 normalized_field, re.IGNORECASE) or
        re.search(r"\(.*\)", normalized_field) and len(re.findall(r"\w+", re.search(r"\(.*\)", normalized_field).group())) <= 5):
        return "radio_buttons"
    
    # Multiple choice options - Checkboxes (select multiple)
    if (re.search(r"\b(select\s+(?:all\s+that\s+apply|multiple)|choose\s+(?:all\s+that\s+apply|multiple)|check\s+all|multiple\s+(?:selection|choice))\b", 
                 normalized_field, re.IGNORECASE) or
        re.search(r"[\[\(]\s*[\]\)]", normalized_field) or
        re.search(r"☐|□|■|\[[\s_]*\]", normalized_field)):
        return "checkboxes"
    
    # Dropdown/Select lists (typically for selections with many options)
    if (re.search(r"\b(dropdown|drop\s*down|select\s+from|choose\s+from|pick\s+from|list|menu|options)\b", 
                 normalized_field, re.IGNORECASE) and
        not re.search(r"\b(select\s+all|choose\s+all)\b", normalized_field, re.IGNORECASE)):
        return "dropdown"
    
    # Password fields
    if re.search(r"\b(password|passcode|pin|secret\s+code|security\s+code)\b", 
                normalized_field, re.IGNORECASE):
        return "password"
    
    # File upload fields
    if re.search(r"\b(upload|attach|file|document|photo|picture|image|upload\s+file|attachment)\b", 
                normalized_field, re.IGNORECASE):
        return "file_upload"
    
    # Text area for longer text inputs
    if (re.search(r"\b(comment|message|description|explain|elaborate|details|specify|notes|feedback|essay|paragraph|bio|biography|overview|summary)\b", 
                 normalized_field, re.IGNORECASE) or
        len(field) > 50):  # Longer prompts likely need more space
        return "textarea"
    
    # Default to single line text input
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
                        elements.append((1, line.strip() + 'Field_Type:= ' +  categorize_fields(line.strip())))  # Use 1 as y-position for text
            
            # Add all elements to document content
            document_content.extend(element[1] for element in elements)
    
    return '\n'.join(filter(None, document_content))


# Extract text
clean_text = extract_text_from_pdf(path)

# Parse form fields
# parse_form(clean_text)

# Print extracted variables
# pretty_json = json.dumps(parsed_fields, indent=4)

# Print the pretty JSON string
# print(clean_text)

# print(parse_document(clean_text))


###############################  REST API ##############################

from flask import Flask, jsonify
from flask_cors import CORS 
app = Flask(__name__)

CORS(app, origins="http://localhost:3000")

@app.route('/api/data', methods=['GET'])
def get_data():
    json_data = parse_document(clean_text)
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(debug=True, port=4000)  # Runs the server on localhost:3000