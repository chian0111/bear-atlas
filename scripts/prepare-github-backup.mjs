// Prepare a restorable original-history backup for the authorized private GitHub connector.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const dir=resolve(process.argv[2]||'');if(!process.argv[2])throw Error('Provide an output directory outside the checkout.');
if(dir.startsWith(process.cwd()+'/'))throw Error('Backup must be outside checkout to avoid recursive archives.');
const run=(args)=>{const r=spawnSync('git',args,{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||'Git backup failed.');return r.stdout.trim();};
for(const row of JSON.parse(readFileSync('docs/release-history.json')).versions){run(['cat-file','-e',row.commit+'^{commit}']);const tag='bear-atlas-v'+row.version;const r=spawnSync('git',['rev-parse','--verify','refs/tags/'+tag],{encoding:'utf8'});if(r.status===0&&r.stdout.trim()!==row.commit)throw Error('Release tag mismatch: '+tag);if(r.status!==0)run(['tag',tag,row.commit]);}
mkdirSync(dir,{recursive:true});const bundle=dir+'/sites-history.bundle';run(['bundle','create',bundle,'--all']);run(['bundle','verify',bundle]);
const manifest={repository:'chian0111/bear-atlas',mode:'connector-source-and-restorable-history',source_commit:run(['rev-parse','HEAD']),bundle:'sites-history.bundle',bundle_sha256:createHash('sha256').update(readFileSync(bundle)).digest('hex'),versions:JSON.parse(readFileSync('docs/release-history.json')).versions.length,commits:Number(run(['rev-list','--all','--count'])),restore:'git clone sites-history.bundle bear-atlas-restored',note:'Original commits and version tags are inside the bundle. GitHub connector commits have separate SHAs.'};writeFileSync(dir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
