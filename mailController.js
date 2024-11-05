const nodemailer = require('nodemailer');

function enviarCorreo(solicitante){
    // Configuración del transporte
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
        user: 'mazariegoslopezoscar@gmail.com',
        pass: 'hbqwlzhkasxzxedn'
        }
    });
  
    // Contenido del correo
    let mailOptions = {
    from: 'mazariegoslopezoscar@gmail.com',
    to: 'oscarmazariegoss7@gmail.com',
    subject: 'Nueva Requisición de Artículos',
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
            <div style="text-align: left;">
                <img src="https://rgm.gob.gt/wp-content/uploads/2023/08/Logo-RGM-Transp-Color_nw.png" alt="Imagen de ejemplo" style="max-width: 150px; height: auto;">
                <h1 style="color: #333; font-family: Arial, sans-serif;">Requisición Solicitada</h1>
                <h2 style="color: #666; font-family: Arial, sans-serif;">El usuario ${solicitante} a solicitado artículos.</h2>
                <p style="color: #999; font-family: Arial, sans-serif;">Este es un correo automático, por favor no responder.</p>
            </div>
        </body>
        </html>
    `
    };
  
    // Envío del correo
    transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Correo enviado: ' + info.response);
    }
    });
}


module.exports = {
    enviarCorreo,
};