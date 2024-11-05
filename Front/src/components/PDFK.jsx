"use client";
import {Document, Text, Page, StyleSheet, Image, View } from '@react-pdf/renderer';

function PDFK( {Reporte, Datos, FechaI, FechaF, Autor, CodigoArticulo, NombreArticulo}){

const [code, ...descriptionArray] = NombreArticulo.split(' ');
const description = descriptionArray.join(' ');

// Estilos para el documento
const styles = StyleSheet.create({
  page: { textAlign: 'center', paddingTop: 35, paddingBottom: 65, paddingHorizontal: 25, },
  principal: { marginBottom: 20, marginLeft: 10, marginRight: 10 },
  title: { fontSize: 24, marginTop: 30, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginTop: 60, marginBottom: 10, textAlign: 'center' },
  logoContainer: { position: 'absolute', top: 0, right: 0, alignItems: 'center', textAlign: 'center' },
  logo: { width: 150, },
  pageNumber: { position: 'absolute', fontSize: 12, bottom: 30, left: 0, right: 0, textAlign: 'center', color: 'grey', },
  table: { width: '100%', border: '2px solid black', borderCollapse: 'collapse', marginTop: 20 },
  tableRow: { flexDirection: 'row', fontSize: 4, },
  tableCell: { border: '1px solid #000', padding: 2, fontSize: 6, textAlign: 'center' },
  tableCell2: { border: '1px solid #000', padding: 2, fontSize: 6, backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' },
  dateContainer: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, },
  dateText: { fontSize: 12, fontWeight: 'bold', },
});

let th = [];
switch (Reporte) {
  case 'kardex':
      th = [['Referencia', 'Documento', 'Fecha','Entrada', 'Salida', 'Existencia']];
      break;
}

const calcularAnchosColumnas = (datos, headers) => {
  const anchos = headers[0].map(header => header.length);

  datos.forEach(row => {
    row.forEach((cell, index) => {
      if (cell.length > anchos[index]) {
        anchos[index] = cell.length;
      }
    });
  });

  const totalAncho = anchos.reduce((acc, curr) => acc + curr, 0);
  return anchos.map(ancho => (ancho / totalAncho) * 100);
};

const crearEstilosDinamicos = (anchos) => {
  return anchos.map((ancho, index) => ({
    width: index === 0 ? '50%' : `${(100 - 50) / (anchos.length - 1)}%`,
    border: '1px solid #000',
    padding: 1,
    fontSize: 8,
    textAlign: 'center'
  }));
};

const anchosColumnas = calcularAnchosColumnas(Datos, th);
const estilosDinamicos = crearEstilosDinamicos(anchosColumnas);

// Componente de tabla dinámica
const renderEncabezado = () => {
    let rows = [];
    for (let i = 0; i < th.length; i++) {
      const row = th[i];
      rows.push(
        <View style={styles.tableRow} key={i}>
          {row.map((cell, cellIndex) => (
            <Text style={{ ...styles.tableCell2, ...estilosDinamicos[cellIndex] }} key={cellIndex}>{cell}</Text>
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
          {row.slice(1).map((cell, cellIndex) => (
            <Text style={{ ...styles.tableCell, ...estilosDinamicos[cellIndex] }} key={cellIndex}>{cell}</Text>
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
                    <Text style={styles.dateText}>Fecha de inicio: {FechaI}</Text>
                    <Text style={styles.dateText}>Fecha final: {FechaF}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Código Artículo: {code}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Descripción: {description}</Text>
            </View>
            <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Usuario: {Autor}</Text>
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

export default PDFK;