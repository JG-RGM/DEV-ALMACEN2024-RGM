"use client";
import {Document, Text, Page, StyleSheet, Image, View } from '@react-pdf/renderer';

function PDF( {Reporte, Datos, FechaI, FechaF, Autor,}){

// Estilos para el documento
const styles = StyleSheet.create({
    page: {  textAlign: 'center', paddingTop: 35, paddingBottom: 65,  paddingHorizontal: 5,},
    principal: {  marginBottom: "20px", marginBottom: "50px", marginLeft: "10px", marginRight: "10px"},
    title: { fontSize: 24, marginTop: 30, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
    subtitle: { fontSize: 18, marginTop: 60, marginBottom: 10, textAlign: 'center' },
    logoContainer: { position: 'absolute', top: 0, right: 0, alignItems: 'center', textAlign: 'center' },
    logo: { width: 150, },
    pageNumber: { position: 'absolute', fontSize: 12, bottom: 30, left: 0, right: 0, textAlign: 'center', color: 'grey', },
    table: { width: '100%', border: '2px solid black' ,borderCollapse: 'collapse',},
    tableRow: { flexDirection: 'row', fontSize: 8, },
    tableCell: { border: '1px solid #000', padding: 2, width: '40%', fontSize: 10 },
    tableCell2: { border: '1px solid #000', padding: 2, width: '40%', fontSize: 10, backgroundColor: 'black', color: 'white',  fontWeight: 'bold' },
    dateContainer: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, },
    dateText: { fontSize: 12, fontWeight: 'bold', },
});

let th = [];
switch (Reporte) {
  case 'familias':
      th = [['Código', 'Familia', 'Prefijo','Estado']];
      break;
  case 'marcas':
      th = [['Código', 'Marca', 'Estado']];
      break;
  case 'concentraciones':
    th = [['Código', 'Concentración', 'Estado']];
      break;
  case 'presentaciones':
    th = [['Código', 'Presentación', 'Estado']];
      break;
  case 'perecederos':
    th = [['Código', 'Nombre', 'Marca', 'Familia', 'Cantidad', 'Fecha Vencimiento']];
      break;
  case 'inventario':
    th = [['Código', 'Nombre', 'Marca', 'Familia', 'Presentación', 'Concentración', 'Saldo inicial', 'Ingresos', 'Salidas', 'Existencia']];
      break;
  case 'ingresos':
    th = [['Código', 'Solicitante', 'Observación', 'Fecha', 'Despacho', 'Requisición', 'Estado']];
      break;
  case 'requisiciones':
    th = [['Código', 'Solicitante', 'Observación', 'Fecha', 'Fecha Despacho', 'Estado']];
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
            <Text style={styles.subtitle}>Reporte de {Reporte}</Text>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} src="/LogoRGM.jpg" />
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Autor: {Autor}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Fecha de inicio: {FechaI}</Text>
                    <Text style={styles.dateText}>Fecha final: {FechaF}</Text>
            </View>
            <View style={styles.table}>
                {renderEncabezado()}
                {renderRows()}
            </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )} fixed />
    </Page>
  </Document>
);
}

export default PDF;