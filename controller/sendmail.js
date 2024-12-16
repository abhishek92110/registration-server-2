
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const convertImageToBase64 = (imagePath) => {
  const file = fs.readFileSync(imagePath);
  return `data:image/png;base64,${file.toString('base64')}`;
};

const logoBase64 = convertImageToBase64(path.join(__dirname, '../image/logo.png'));
const logo2Base64 = convertImageToBase64(path.join(__dirname, '../image/1stlogo.jpeg'));
const authSign = convertImageToBase64(path.join(__dirname, '../image/auth-sign.jpg'));

const generatePdf = async (htmlContent, cssContent) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
        await page.addStyleTag({ content: cssContent });

        const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};

const sendmail = async (req, res) => {
    const email = req.body.email ? req.body.email : req.body.Email;
    const data = req.body; // Assuming data is present in the request body

    console.log("email ", email);

    try {
        const htmlContent = `
            <div id="element">
                <div id="invoice-POS">
                    <div id="top">
                        <img src="${logoBase64}" />
                        <img className="logo1" src="${logo2Base64}" />
                    </div>
                    <div id="mid">
                        <h1 class="heading mb-3">Registration Acknowledgement Receipt</h1>
                    </div>
                    <div id="bot">
                        <div id="table">
                            <table>
                                <tbody>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Registration No.</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.RegistrationNo}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Student's Name</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.Name}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Student's Mobile No.</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">+91 ${req.body.Number}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Father's/Guardian Name</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.Pname}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Course Name</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.subCourse}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Course Fees</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.CourseFees}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Payment Method</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.PaymentMethod}</h6></td>
                                    </tr>
                                    ${req.body.PaymentMethod === "Installment" ? `
                                        <tr class="service">
                                            <td class="tableitem"><h6 class="itemtext">Total Installment</h6></td>
                                            <td class="tableitem"><h6 class="itemtext">${req.body.totalInstallment}</h6></td>
                                        </tr>
                                    ` : ''}
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Registration Fees</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.RegistrationFees}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Registration Date</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.RegistrationDate}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Payment Mode</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.PaymentMode}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Remaining Fees</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.RemainingFees}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Preferred Batch Join Date & Time</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.joinDate} ${req.body.joinTime}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Counsellor Name</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.Counselor}</h6></td>
                                    </tr>
                                    <tr class="service">
                                        <td class="tableitem"><h6 class="itemtext">Counsellor Mobile No.</h6></td>
                                        <td class="tableitem"><h6 class="itemtext">${req.body.counselorNumber}</h6></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="Signaturee">
                            <div class="authorised-sign">
                                <div class="imaging">
                                    <img src="${authSign}" alt="" />
                                </div>
                                <div class="signature2-section">
                                    <h2>Authorised Signature</h2>
                                </div>
                            </div>
                            <div class="signature-section">
                                <h2>Student Signature</h2>
                            </div>
                        </div>
                        <div id="legalcopy">
                            <h6 class="legal">
                                <strong>Note : </strong>
                                <ul className="registration-point" style="display:grid; grid-template-columns:auto auto; row-gap:10px; col-gap:20px;">
                  
                  <span>1.</span>
                  <li>
                  
                    This is an Registation Acknowledgement receipt only. Your admission in the
                    mentioned course is subject to full fee payment, EMI
                    document submission, and installation payment within 7 days
                    of batch allocation.
                  </li>
                  
                  <span>2.</span>
                  <li>
                  
                    Students who choose the installments/EMI option may ensure
                    to pay the instalments and submit the EMI document within 7
                    days of starting the batch, failing which a ₹500/- per day
                    late fee will be charged.
                  </li>
                  
                  <span>3.</span>
                  <li>
                  
                    After the allocation of the batch, if you are facing any
                    issues regarding class timing, trainers, or being unable to
                    continue class due to some reason, inform your counsellor
                    immediately & HR Dept., Uncodemy, at  <span class="notes-diff-text">
                    hrdept@uncodemy.com
                      </span>
                    within 7 days of starting the batch.
                  </li>
                  <span>4.</span>
                  <li>
                  
                    Lifetime Membership/Access in Class and Training until
                    Placement and Access in Multiple Batches/Trainers is subject
                    to full fee payment by the students.
                  </li>
                  
                  <span>5.</span>
                  <li>
                  
                    Apart from class and training in the above-mentioned course
                    and course completion certificate, revision sessions, doubt
                    sessions, confidence-building sessions, grooming sessions,
                    communication sessions, CV-building sessions, technical
                    sessions, and interview sessions are also provided in the
                    same course fee. No additional charges need to be given by
                    students.
                  </li>
                  
                  <span>6.</span>
                  <li>
                  
                    For any support or complaint assistance regarding classes
                    and training,
                    <b>
                      write us at
                      <span class="notes-diff-text">
                        support@uncodemy.com
                      </span>
                      or contact or WhatsApp our support team at
                      <span class="notes-diff-text">+91 8800023723</span>.
                    </b>
                  </li>
                </ul>
                            </h6>
                        </div>
                        <div class="info address-info">
                            <h2><strong>Contact Info</strong></h2>
                            <h6>
                                <strong>Address :</strong> B 14-15, Udhyog Marg, Block B, Sector 1, Noida, Uttar Pradesh 201301, Near Sector-15 Metro Station.
                                <br />
                                <strong>Phone :</strong>+91 7701928515, +91 8800023848
                                <br />
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const cssContent = `
            #invoice-POS {
                padding: 5px;
                margin: 0 auto;
                width: 90vw;
                background: #FFF;
            }
            #top img {
                width: 18%;
                height: 128px;
            }
            .logo1 {
                height: 54px !important;
                width: 163px !important;
            }
            .heading {
                margin: -23px 0;
                text-align: center;
                border-bottom: 1px solid #ff5421;
            }
            #bot { min-height: 50px; }
            .heading_table {
                color: #000000DE;
                font-size: 16px;
            }
            .itemtext {
                padding: 3px;
                font-size: 15px;
                color: black !important;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            .service {
                border-bottom: 1px solid #EEE;
            }

            li {
              list-style: none !important;
          }

            h6, .h6 {
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
              font-weight: 500;
              line-height: 1.2;
              color: #3d4465;
          }

          .registration-point{
              display:flex !important;
              row-gap: 10px;
              col-gap:10px;
              margin-top: 5px;
          }
          
          .registration-point span{
            font-weight: 700;
            font-size: 12px;           
          }
          
          .registration-point li{
          
            margin-left: 10px;
            font-size: 12px;
            color: black !important;
            list-style:none !important;
          }
          
          .notes-diff-text{
            color:#ff5421;
          }

          .imaging img {
            width: 90px;
            height: 40px;
        }

          .Signaturee h2{
            color: black !important;
          }
          
          .registration-point li::marker{
            font-weight: 700;
          }
          
          .imaging img{
            width: 90px;
            height: 40px;
          }
          .signature2-section{
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          /* margin: 30px 0; */
          }
          .signature-section{
          display: flex;
          align-items: end;
          justify-content: flex-end;
          padding: 0 10px;
          /* margin: 30px 0; */
          }
          .Signaturee{
            padding: 13px 0px 2px 0px;
            display: flex;
            justify-content: space-between;
          }

          .item{width: 24mm;}

          .info{
            display: block;
            margin-left: 0;
            
          }
          
          .address-info{
            background: #ff8c5e47;
            padding: 5px;
          }
          
          .address-info h6{
            color: black;
            margin: 0;
          }
          .address-info h2{
            color: black;
            margin-bottom: 2px;
          }
          
          .media-body p{
            color:white;
          }
          
          .title{
            float: right;
          }
          
          .title p{text-align: right;} 
          
          table{
            width: 100%;
            border-collapse: collapse;
          }
          
          .tabletitle{
            font-size: .5em;
            background: #EEE;
          }

          h1{
            font-size: 1.5em;
            color: #222;
          }
          h2{font-size: .9em;}
          h3{
            font-size: 1.2em;
            font-weight: 300;
            line-height: 2em;
          }
          p{
            font-size: .7em;
            color: #666;
            line-height: 1.2em;
          }

          .mb-3, .my-3 {
            margin-bottom: 1rem !important;
        }

        h1 {
          font-size: 1.5em;
          color: #222;
      }

      .registration-point li {
        margin-left: 10px;
        font-size: 12px;
        color: black !important;
    }

    .address-info {
      background: #ff8c5e47;
      padding: 5px;
  }

  .info {
    display: block;
    margin-left: 0;
  }

  [data-typography="roboto"] {
    font-family: 'Roboto', sans-serif;
}

        `;

        const pdfBuffer = await generatePdf(htmlContent, cssContent);

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                // user: 'vinay.uncodemy@gmail.com',
                // pass: 'evwptfyxlwhaegvj'
                user: 'account@uncodemy.com',
                pass: 'enuvnrptyrgolyjk'
            },
        });

        transporter.sendMail({
            from: "account@uncodemy.com",
            to: email,
            subject: "Registration Acknowledgement Receipt",
            text: `Please find attached`,
            html: `<b>Dear ${req.body.Name}</b>,
            <br><br>
            Welcome to Uncodemy Edutech Pvt. Ltd., India's top IT Training Institute!
            <br><br>
            <b>Congratulations!</b> on your registration in <b>${req.body.subCourse}</b> Industrial Training Program . We are known for <b>${req.body.subCourse}</b> Training & placement from many years.
            <br><br>

            Here are your Registration Details, plz save it for further communication with us:
            <br><br>
            <b>Your Course Fee Details :</b> 
            <br><br>
            <b>Course Name:</b> ${req.body.subCourse}
            <br>
            <b>Date of Registration:</b> ${req.body.RegistrationDate}
            <br>
            <b>Total Fees:</b> ${req.body.CourseFees}/-
            <br>
            <b>Payment Option Chosen:</b> ${req.body.PaymentMethod}  
            <br>
            <b>Registration Amount:</b> ${req.body.RegistrationFees}/-  (Registration receipt Enclosed)
            <br>
            <b>Pending Amount:</b> ${req.body.RemainingFees}/- 
    ${req.body.RemainingFees !== 0 ? `${req.body.PaymentMethod === "OTP" ? "(in One Time)" : req.body.PaymentMethod === "EMI" ? `(${req.body.PaymentMode})`:`(in ${req.body.totalInstallment})`}` : ''}

            <br>
            <b>Enrollment ID:</b> ${req.body.RegistrationNo}
            <br><br>
            
            <b>Note:</b>
            <br>
            1. Payments of your Instalments is subject to following T&C:
            <br>
            <b>1st Instalment :</b> After 3 Days of Batch allocation.
            <br>
            <b>2nd Instalment :</b> With in 30 Days of the Date of Batch Allocation.
            <br><br>
            2. If you failed to make your payment on time, A late fee ₹500/- per day will be applicable accordingly.
            <br>
            3. <b>Your batch allocation is pending. So it is advised to you that you please join your batches as soon as possible or within 60 days of your date of registration; otherwise, your registration will be cancelled.</b>
            <br><br>
            <b>PLEASE READ CAREFULLY BELOW POINTS : </b>
            <br><br> 
            1. This is a Registration acknowledgement receipt only. Your admission in the mentioned course is subject to full fee payment, EMI document submission, and instalment payment within 7 days of batch allocation.<br>
            2. Students who choose the instalments/EMI option may ensure to pay the instalments and submit the EMI document within 7 days of starting the batch, failing which a ₹500/- per day late fee will be charged.<br>
            3. The late charges on the first instalment are ₹500/- per day, and the late charges on the second to final instalments are ₹250/- per day.<br>
            4. After the allocation of the batch, if you are facing any issues regarding class timing, trainers, or being unable to continue class due to some reason, inform your counsellor immediately & HR Dept., Uncodemy, at hrdept@uncodemy.com within 7 days of starting the batch.<br>
            5. In mid of class and Training, if any student says that they want to hold/ stop their classes for some time, they have to submit their full fee after that we will provide another batch; otherwise, their registration will be cancelled.<br>
            6. If any student submits their full payment and then they want to hold their classes, they have to mail the HR Department with a proper reason & documents at (hrdept@uncodemy.com ).<br>
            7. Lifetime Membership/Access in Class and Training until Placement and Access in Multiple Batches/Trainers is subject to full fee payment by the students and need prior permission to join any other batch.<br>
            8. Apart from class and training in the above-mentioned course and course completion certificate, revision sessions, doubt sessions, confidence-building sessions, grooming sessions, communication sessions, CV-building sessions, technical sessions, and interview sessions are also provided in the same course fee. No additional charges need to be given by students.<br>
            9. For any support or complaint assistance regarding classes and training, write us at support@uncodemy.com or contact or WhatsApp our Student Care No./Support team at +91-8800023723.<br>
            <br><br>
            Here is our Fee Payment Portal Link for further fee payment process :<br>
            https://www.uncodemy.com/fee-payment
            <br><br>
            Here's to your success, your growth, and a future filled with endless possibilities!
            <br><br>
            Enclosed: registration receipt.
            <br><br><br><br>
            
            Warm regards,<br>
            Admission & Account Dept.<br>
            Uncodemy Edutech Pvt. Ltd.<br>
            Contact No. - 9205444136, 9319193481<br>
            Website: www.uncodemy.com`,
            attachments: [
                {
                    filename: `${req.body.Name}-${req.body.RegistrationNo}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        }, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("An error occurred while sending the email.");
            } else {
                console.log("Email sent:", info.response);
                res.status(200).send("Email sent successfully.");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while sending the email.");
    }
};

module.exports = sendmail;



