export const registrationEmailTemplate = (trainername: string): string => `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <html lang="en">
      <head></head>
      <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">The universal hub for AI generations.<div></div>
      </div>
      <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
          <tr style="width:100%">
            <td><img alt="Koala" src="https://i.ibb.co/3RkbRCD/logo-blue.png" width="100" height="100" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />
              <p style="font-size:16px;line-height:26px;margin:16px 0">Hi ${trainername},</p>
              <p style="font-size:16px;line-height:26px;margin:16px 0">Welcome to Brain Stack, the universal Hub for AI generations. You can try it for free right now!</p>
                <table style="text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td><a href="https://brain-stack.com/saas-product" target="_blank" style="background-color:#389ABB;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#389ABB;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Get started</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                    </tr>
                  </tbody>
                </table>
              <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br />The Brain Stack team</p>
              <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
            </td>
          </tr>
        </table>
      </body>
    </html>
`;
