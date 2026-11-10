content = open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'r', encoding='utf-8').read()

# Find the esc function and replace the replacement object
# The current replacement object has literal chars: '&':'&', '<':'<', '>':'>', '"':'"', "'":'''
# We need: '&':'&', '<':'<', '>':'>', '"':'"', "'":'''
# HTML entities: & < > " '

# Replace the entire esc function line
import re
pattern = r"var esc=function\(s\)\{return String\(s==null\?'':s\)\.replace\(/\[\&<>\"'\]/g,function\(m\)\{return \{[^}]+\}\[m\]\}\)\};"
replacement = """var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[m]})};"""
content = re.sub(pattern, replacement, content)

with open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed esc function')