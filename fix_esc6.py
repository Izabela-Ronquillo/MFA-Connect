content = open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'r', encoding='utf-8').read()

# Direct string replacement with actual HTML entities
old = 'var esc=function(s){return String(s==null?\'":s).replace(/[&<>"\']/g,function(m){return {\'&\':\'&\',\'<\':\'<\',\'>\':\'>\',"\\"":"\\"","\'":"\'"}[m]})};'
new = 'var esc=function(s){return String(s==null?\'":s).replace(/[&<>"\']/g,function(m){return {\'&\':\'&\',\'<\':\'<\',\'>\':\'>\',"\\"":""","\'":"'"}[m]})};'

if old in content:
    content = content.replace(old, new)
    with open(r'C:\SIA\MFA-Connect\student-dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced')
else:
    print('Old not found')
    idx = content.find('var esc=')
    print(content[idx:idx+150])