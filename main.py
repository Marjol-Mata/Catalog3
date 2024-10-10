import pandas as pd
from docx import Document

excel_file = 'nr_llog.xlsx'
df = pd.read_excel(excel_file, dtype=str)

word_file = 'Payroll Contract.docx'
output_word = 'output.docx'

for index, row in df.iterrows():
    doc = Document(word_file)

    for paraghraph in doc.paragraphs:
        for run in paraghraph.runs:
            if 'XXXX' in run.text:
                run.text = run.text.replace('XXXX', str(row['Emer Mbiemer']))
            if 'AAAA' in run.text:
                run.text = run.text.replace('AAAA', str(row['Nr. klienti']))
            if 'ZZZZ' in run.text:
                run.text = run.text.replace('ZZZZ', str(row['Nr.llogarise']))
        
    doc.save(f"{row['Emer Mbiemer']}.docx")

print("Documents created successfuly.")