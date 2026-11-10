content = open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'r', encoding='utf-8').read()
# The file has literal & < > " ' in the replacement object
# Replace with proper HTML entity strings
content = content.replace(
    "{'&':'&','<':'<','>':'>','\"':'\"',\"'\":\"'\"}",
    "{'&':'&','<':'<','>':'>','\"':'"',\"'\":\"'\"}"
)
with open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed esc function')