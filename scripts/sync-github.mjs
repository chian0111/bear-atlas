// Mirror full source history and saved-version tags into an explicitly selected repository.
// Uses existing gh/git authentication; never accepts or prints tokens.
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
if(process.argv[2]==='--prepare-connector'){const r=spawnSync(process.execPath,['scripts/prepare-github-backup.mjs',process.argv[3]],{stdio:'inherit'});process.exit(r.status??1);}
const repo=process.argv[2];
if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo||''))throw Error('Provide the authorized owner/repository.');
function run(cmd,args,capture=false){const r=spawnSync(cmd,args,{encoding:'utf8',stdio:capture?'pipe':'inherit'});if(r.status!==0)throw Error('GitHub synchronization stopped: command failed.');return (r.stdout||'').trim();}
run('gh',['auth','status']);run('gh',['repo','view',repo,'--json','nameWithOwner']);
run('gh',['auth','setup-git','--hostname','github.com']);
const records=JSON.parse(readFileSync('docs/release-history.json','utf8')).versions,refs=[];
for(const row of records){const tag='bear-atlas-v'+row.version;run('git',['cat-file','-e',row.commit+'^{commit}']);const existing=spawnSync('git',['rev-parse','--verify','refs/tags/'+tag+'^{commit}'],{encoding:'utf8'});if(existing.status===0&&existing.stdout.trim()!==row.commit)throw Error('A release tag already points to another commit.');if(existing.status!==0)run('git',['tag',tag,row.commit]);refs.push('refs/tags/'+tag);}
const remote='https://github.com/'+repo+'.git';
run('git',['push','--atomic',remote,'HEAD:refs/heads/bear-atlas',...refs]);
const head=run('git',['rev-parse','HEAD'],true),remoteHead=run('git',['ls-remote',remote,'refs/heads/bear-atlas'],true).split(/\s+/)[0];
if(head!==remoteHead)throw Error('Remote verification did not match the source commit.');
console.log('Verified GitHub mirror: '+repo+' branch bear-atlas at '+head);
