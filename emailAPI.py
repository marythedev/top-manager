import os, sys, smtplib
from dotenv import load_dotenv

load_dotenv()
from_email = os.getenv('EMAIL')
to_email = os.getenv('TO_EMAIL')
password = os.getenv('PASSWORD')
subject = "TOPMANAGER SUPPORT CONTACT"

smtp = smtplib.SMTP('smtp.gmail.com', 587)
smtp.starttls()
smtp.login(from_email, password)
smtp.sendmail(from_email, [to_email, from_email],
    f"to:{to_email}\nbcc:{from_email}\nSubject:{subject}\n{sys.argv[1]}")
smtp.quit()