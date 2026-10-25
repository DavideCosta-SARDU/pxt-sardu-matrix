"""Check block signatures, translations and Help paths without dependencies."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config = json.loads((ROOT / 'pxt.json').read_text(encoding='utf-8'))
blocks = {}
errors = []
if config['name'] != 'pxt-sardu-matrix':
    errors.append('Package name must match the canonical repository name used by the tutorial loader')
pattern = re.compile(
    r'(?P<annotations>(?:^[ \t]*//[^\n]*\n)+)[ \t]*'
    r'(?:export function )?(?P<name>\w+)\((?P<params>[^)]*)\)', re.M
)
for path in ROOT.glob('*.ts'):
    source = path.read_text(encoding='utf-8')
    for match in pattern.finditer(source):
        annotations = match['annotations']
        block_id = re.search(r'\bblockId=(\w+)', annotations)
        label = re.search(r'\bblock="([^"]*)"', annotations)
        if not block_id or not label:
            continue
        block_id = block_id[1]
        params = re.findall(r'\b(\w+)\s*:', match['params'])
        if path.name == 'matrix.ts':
            params.insert(0, 'this')
        placeholders = re.findall(r'[%$](\w+)', label[1])
        if placeholders != params:
            errors.append(f'{block_id}: label {placeholders} != signature {params}')
        if re.search(r'%(?!\w)', label[1]):
            errors.append(f'{block_id}: unescaped percent in block label')
        if block_id in blocks:
            errors.append(f'{block_id}: duplicate block ID')
        blocks[block_id] = (label[1], annotations, match['name'], path.name)
        for help_path in re.findall(r'\bhelp=github:([^\s]+)', annotations):
            package, relative = help_path.split('/', 1)
            if package != config['name'] or relative + '.md' not in config['files']:
                errors.append(f'{block_id}: invalid Help path {help_path}')

for block_id, (label, annotations, name, filename) in blocks.items():
    for shadow in re.findall(r'\b\w+\.shadow=(\w+)', annotations):
        if shadow in blocks and '$this' in blocks[shadow][0]:
            errors.append(f'{block_id}: method receiver inside shadow {shadow}')
    if not block_id.startswith('sardu_matrix_graphic_row') and 'help=github:' not in annotations:
        errors.append(f'{block_id}: missing Help path')

translations = [ROOT / '_locales/pxt-sardu-matrix-strings.json', ROOT / '_locales/it/pxt-sardu-matrix-strings.json']
for path in translations:
    data = json.loads(path.read_text(encoding='utf-8'))
    for block_id, (label, annotations, name, filename) in blocks.items():
        qname = 'sarduMatrix.' + ('Matrix.' if filename == 'matrix.ts' else '') + name
        translated = data.get(qname + '|block')
        if translated is None:
            continue  # Missing optional translations use the source label.
        if re.findall(r'[%$](\w+)', translated) != re.findall(r'[%$](\w+)', label):
            errors.append(f'{path.relative_to(ROOT)}: mismatched parameters for {qname}')
        if re.search(r'%(?!\w)', translated):
            errors.append(f'{path.relative_to(ROOT)}: unescaped percent for {qname}')

for filename in config['files'] + config.get('testFiles', []):
    if not (ROOT / filename).is_file():
        errors.append(f'missing package file: {filename}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'{len(blocks)} block signatures, shadow references, Help paths and English/Italian placeholders passed.')
