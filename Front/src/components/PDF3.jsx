"use client";
import {Document, Text, Page, StyleSheet, Image, View, pdf } from '@react-pdf/renderer';

function PDF3( {Reporte, Datos, Informacion, Autor}){

// Estilos para el documento
const styles = StyleSheet.create({
    page: {  textAlign: 'center', paddingTop: 35, paddingBottom: 65,  paddingHorizontal: 35,},
    principal: {  marginBottom: "20px", marginBottom: "50px", marginLeft: "20px", marginRight: "50px"},
    title: { fontSize: 24, marginTop: 30, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },  
    subtitle: { fontSize: 16, marginTop: 60, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
    subtitle2: { fontSize: 12, marginTop: 5, marginBottom: 10, textAlign: 'center' },
    firmas1: { fontSize: 10, marginTop: 5, marginBottom: 10, textAlign: 'left' },
    firmas2: { fontSize: 10, marginTop: 5, marginBottom: 10, textAlign: 'center' },
    firmas3: { fontSize: 10, marginTop: 5, marginBottom: 10, textAlign: 'right' },
    logoContainer: { position: 'absolute', top: 0, right: 0, alignItems: 'center', textAlign: 'center' },
    logo: { width: 150, },
    pageNumber: { position: 'absolute', fontSize: 12, bottom: 30, left: 0, right: 0, textAlign: 'center', color: 'grey', },
    table: { width: '100%', border: '2px solid black' ,borderCollapse: 'collapse',},
    tableRow: { flexDirection: 'row' },
    tableCell: { border: '1px solid #000', padding: 2, width: '40%', fontSize: 10 },
    tableCell2: { border: '1px solid #000', padding: 2, width: '40%', fontSize: 10, backgroundColor: 'black', color: 'white',  fontWeight: 'bold' },
    dateContainer: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, },
    dateText: { fontSize: 12, fontWeight: 'bold', },
    signatureContainer1: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 10,
    },
    signatureContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 50,
      marginBottom: 10,
    },
    signatureColumn: {
        alignItems: 'center',
    },
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: 125, // Ancho de la línea de firma (puedes ajustar según necesites)
        marginBottom: 5,
    },
    signatureName: {
        fontSize: 10,
    },
    dateTextB: {
      fontWeight: 'bold', // Esto hace que el texto esté en negrita
    },
  });

let th = [];
switch (Reporte) {
  case 'ingreso':
      th = [['Código', 'Artículo', 'Fecha Vencimiento','Cantidad Recibida']];
      console.log('entra ca?');
      break;
}


// Componente de tabla dinámica
const renderEncabezado = () => {
    let rows = [];
    for (let i = 0; i < th.length; i++) {
      const row = th[i];
      rows.push(
        <View style={styles.tableRow} key={i}>
          {row.map((cell, cellIndex) => (
            <Text style={styles.tableCell2} key={cellIndex}>{cell}</Text>
          ))}
        </View>
      );
    }
    return rows;
};

// Componente de tabla dinámica
const renderRows = () => {
    let rows = [];
    for (let i = 0; i < Datos.length; i++) {
      const row = Datos[i];
      rows.push(
        <View style={styles.tableRow} key={i} wrap={false}>
          {row.map((cell, cellIndex) => (
            <Text style={styles.tableCell} key={cellIndex}>{cell}</Text>
          ))}
        </View>
      );
    }
    return rows;
};

return(
    <Document>
    <Page style={styles.page} size="A4" wrap={true}>
        <View style={styles.principal}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} src="/LogoRGM.jpg" />
            </View>
            <Text style={styles.subtitle}>REGISTRO DE GARANTIAS MOBILIARIAS</Text>
            <Text style={styles.subtitle2}>ADQUISICIÓN DE ARTÍCULOS A ALMACEN</Text>
            <View style={styles.logoContainer}>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Usuario: {Autor}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Observaciones: {Informacion.observacion}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>No. Despacho MINECO: {Informacion.despacho}</Text>
                    <Text style={styles.dateText}>No. Requisición MINECO: {Informacion.requisicion}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Fecha: {Informacion.fechaIngreso}</Text>
                    <Text style={styles.dateText}>Adquisición No.: {Informacion.codigo}</Text>
            </View>
            <View style={styles.table}>
                {renderEncabezado()}
                {renderRows()}
            </View>
            <View style={styles.signatureContainer}>
              {/* Apartado de firma a la izquierda */}
              <View style={styles.signatureColumn}>
                  <View style={styles.signatureLine}></View>
                  <Text style={styles.signatureName}>{Informacion.solicitante}</Text>
                  <Text style={styles.signatureName}>Solicitante</Text>
              </View>
              {/* Apartado de firma a la derecha */}
              <View style={styles.signatureColumn}>
                  <View style={styles.signatureLine}></View>
                  <Text style={styles.signatureName}>{Autor}</Text>
                  <Text style={styles.signatureName}>Autorizador</Text>
              </View>
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )} fixed />
    </Page>
  </Document>
);
}

export default PDF3;