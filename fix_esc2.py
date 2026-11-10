content = open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'r', encoding='utf-8').read()
# Fix the esc function - replace literal chars with HTML entity strings
old = """var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[m]})};"""
new = """var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&','<':'<','>':'>','"':'"',"'":"'"}[m]})};"""
content = content.replace(old, new)
with open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed esc function')