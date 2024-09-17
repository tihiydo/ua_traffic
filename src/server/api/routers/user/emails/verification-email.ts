import { env } from "@/env.mjs";
import { generateMailOptions, transporter } from "@/lib/nodemailer";

export const sendVerificationEmail = async (
    email: string,
    verificationToken: string,
) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="utf-8">
        <!-- utf-8 works for most cases -->
        <meta name="viewport" content="width=device-width">
        <!-- Forcing initial-scale shouldn't be necessary -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting">
        <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <title></title>
        <!-- The title tag shows in email notifications, like Android 4.4. -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
        <!-- CSS Reset : BEGIN -->
        <style>
        .logo
        {
        text-align: center;
        color: black;
        margin-top: 2rem;
        font-size: 50px;
        font-weight: 900;
        }

  html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        min-height: 50rem !important;
        width: 100% !important;
        display: flex;
        align-items: center;
        background-color: #f1f1f1;
      }

      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }

      /* What it does: Fixes webkit padding issue. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
      a {
        text-decoration: none;
      }

      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],
      /* iOS */
      .unstyle-auto-detected-links *,
      .aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
        color: inherit !important;
      }

      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img+div {
        display: none !important;
      }

      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */
      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u~div .email-container {
          min-width: 320px !important;
        }
      }

      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u~div .email-container {
          min-width: 375px !important;
        }
      }

      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
        u~div .email-container {
          min-width: 414px !important;
        }
      }
    </style>
    <!-- CSS Reset : END -->
    <!-- Progressive Enhancements : BEGIN -->
    <style>
      .bg_white {
        background: #ffffff;
      }

      .bg_light {
        background: #fafafa;
      }

      .bg_black {
        background: #000000;
      }

      .bg_dark {
        background: rgba(0, 0, 0, .8);
      }

      .email-section {
        padding: 2.5em;
      }

      /*BUTTON*/
      .btn {
        padding: 5px 15px;
        display: inline-block;
      }

      .btnflex
      {
        margin-top: 2rem;
        display: flex;
        place-content: center;
      }
      .btn.btn-primary {
        text-align: center;
        border-radius: 4px;
        background: #ffde59;
        color: black;
        padding: 0.5rem 4rem;
        font-weight: 700;
      }

      
      .btn.btn-white {
        border-radius: 30px;
        background: #ffffff;
        color: #000000;
      }

      .btn.btn-white-outline {
        border-radius: 30px;
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: 'Montserrat', sans-serif;
        color: #000000;
        margin-top: 0;
        font-weight: 400;
      }

      body {
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0, 0, 0, .4);
      }

      .navigation {
        padding: 0;
      }

      .navigation li {
        list-style: none;
        display: inline-block;
        ;
        margin-left: 5px;
        font-size: 13px;
        font-weight: 500;
      }

      .navigation li a {
        color: rgba(0, 0, 0, .4);
      }

      .hero {
        position: relative;
      }

      @media screen and (max-width: 500px) {
        .chiuaua {
          padding: 0 1em !important;
        }

        .chiuaua h1 {
          font-size: 18px !important;
        }

        .chiuaua h2 {
          font-size: 16px !important;
        }

        .chiuaua .event-data {
          font-size: 12px !important;
        }

        .chiuaua .btn-primary {
          font-size: 12px !important;
        }

        .heading-section {
          padding: 0 !important;
        }

        .heading-section h2 {
          font-size: 20px !important;
        }

        .heading-section h3 {
          font-size: 16px !important;
        }

        .heading-section p {
          font-size: 12px !important;
        }

        .inline-member .member-img {
          width: 100px !important;
          height: 100px !important;
        }

        .inline-member h3 {
          margin-top: 0 !important;
        }

        .email-section {
          padding: 0 1em !important;
        }
        
      }
        </style>
      </head>
      <body style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly;">
        <center style="width: 100%; background-color: #f1f1f1;">
            <div style="max-width: 600px; margin: 0 auto; padding: 10rem 0;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto; height: 100%;">
              <tr>
                <td valign="middle" class="hero bg_white">
                  <div style="color: #000000; text-align: left; padding: 0 3rem;" class="logo">UATRAFFIC</div>
                  <table>
                    <tr>
                      <td>
                        <div class="chiuaua" style="color: #000000; text-align: left; padding: 0 4em;">
                          <h2 style="font-weight: 400; color: #000000; font-size: 22px; margin-bottom: 8px;">Для пітвердження реєстрації аккаунту, перейдіть по посиланню.</h2>
                            <div class="btnflex" style="margin: 2rem 0; width: fit-content;"><a href='${env.NEXT_PUBLIC_SITE_URL}/ua/user-verify?verificationToken=${verificationToken}' class="btn btn-primary" style="text-transform: uppercase;">Приєднатися</a></div>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </center>
      </body>
    </html>
`;
    const mailOptions = generateMailOptions(
        [email],
        "UATRAFFIC | Верифікація",
        html,
    );

    await transporter.sendMail(mailOptions);
};