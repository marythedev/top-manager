<?php 

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

//$mail->SMTPDebug = 3;                                 // Enable verbose debug output

$mail->isSMTP();                                        // Set mailer to use SMTP
$mail->Host = 'smtp.mail.ru';  							// Specify main and backup SMTP servers
$mail->SMTPAuth = true;                                 // Enable SMTP authentication
$mail->Username = .$ENV['SUPPORT_EMAIL_FROM'];
$mail->Password = .$ENV['SUPPORT_EMAIL_PASS'];
$mail->SMTPSecure = 'ssl';                              // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                      // TCP port to connect to

$mail->setFrom(.$ENV['SUPPORT_EMAIL_FROM']);            // email sender
$mail->addAddress(.$ENV['SUPPORT_EMAIL_TO']);           // email recipient
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                    // Set email format to HTML

$mail->Subject = 'New Support Email (Top Manager)';
$mail->Body    = '' .$name . ' left a support request. His/her email is ' .$email. '<br>Message is: ' .$message;
$mail->AltBody = '';

if(!$mail->send()) {
    echo 'Error';
} else {
    header('location: https://top-manager.vercel.app/');
}
?>