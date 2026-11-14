import re,json,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[1]
pattern=re.compile(r'[\u3400-\u9fff][\u3400-\u9fff\w\s，。！？、；：「」『』（）《》…／・·—–｜%＋↗✦\-]*')
rows={}
for p in sorted((root/'worker').glob('*.js')):
 if p.name.startswith('i18n'):continue
 domain=p.stem.replace('-','_')
 for i,line in enumerate(p.read_text().splitlines(),1):
  for m in pattern.finditer(line):
   text=re.sub(r'\s+',' ',m.group().strip())
   if text not in rows:rows[text]={'key':domain+'.msg_'+hashlib.sha1(text.encode()).hexdigest()[:10],'zh-TW':text,'en':None,'locations':[]}
   rows[text]['locations'].append(str(p.relative_to(root))+':'+str(i))
out=list(rows.values())
p=root/'worker/locales/messages.json'
if p.exists():
 old={x['zh-TW']:x.get('en') for x in json.loads(p.read_text())}
 for x in out:x['en']=old.get(x['zh-TW'])
p.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'unique':len(out),'source_occurrences':sum(len(x['locations']) for x in out),'translated':sum(bool(x['en']) for x in out),'source_characters':sum(len(x['zh-TW']) for x in out)}))
