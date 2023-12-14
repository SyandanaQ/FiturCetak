import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Modal from 'react-modal';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(module => module.PDFDownloadLink), {
  ssr: false,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '50%',
    padding: 5,
    backgroundColor: 'lightgray',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
});

const paperSizes = [
  { name: 'A4', value: 'A4' },
  { name: 'Letter', value: 'Letter' },
  { name: 'Legal', value: 'Legal' },
  // Tambahkan ukuran kertas lainnya sesuai kebutuhan Anda
];

const students = [
  { nama: 'Rizki', NIM: '001', Prodi: 'Informatika' },
  { nama: 'Deri', NIM: '002', Prodi: 'Informatika' },
  { nama: 'Dana', NIM: '003', Prodi: 'Informatika' },
  
  // Tambahkan data mahasiswa tambahan di sini
];

const StudentCard = ({ student }) => {
  return (
    <div className="card">
      <h4>{student.nama}</h4>
      <p>NIM: {student.NIM}</p>
      <p>Prodi: {student.Prodi}</p>
    </div>
  );
};

const StudentTable = () => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [paperType, setPaperType] = useState('A4');
  const [orientation, setOrientation] = useState('portrait'); // Default ke potret
  const [margin, setMargin] = useState({ top: 5, bottom: 5, left: 5, right: 5 }); // State untuk margin
  const [selectedPaperSize, setSelectedPaperSize] = useState('A4'); // State untuk ukuran kertas

  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  const handleCheckboxChange = (student) => {
    if (selectedStudents.includes(student)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== student));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // Deselect all students
      setSelectedStudents([]);
    } else {
      // Select all students
      setSelectedStudents(students);
    }
    setSelectAll(!selectAll); // Toggle selectAll state
  };

  const handlePrintPDF = () => {
    openPreview();
  };

  const handlePaperTypeChange = (event) => {
    setPaperType(event.target.value);
  };

  // Fungsi untuk mengatur orientasi PDF menjadi potret
  const setPortraitOrientation = () => {
    setOrientation('portrait');
  };

  // Fungsi untuk mengatur orientasi PDF menjadi lanskap
  const setLandscapeOrientation = () => {
    setOrientation('landscape');
  };

  // Fungsi untuk mengatur margin
  const handleMarginChange = (key, value) => {
    setMargin((prevMargin) => ({
      ...prevMargin,
      [key]: value,
    }));
  };

  const handlePaperSizeChange = (event) => {
    setSelectedPaperSize(event.target.value); // Fungsi ini akan mengubah ukuran kertas yang dipilih
  };


  return (
    <div>
      <h2>Daftar Mahasiswa</h2>
      <div className="student-list">
      <label>Pilih Ukuran Kertas:</label>
        <select onChange={handlePaperSizeChange} value={selectedPaperSize}>
          {paperSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.name}
            </option>
          ))}
        </select>

        <label>
          <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /> Pilih Semua
        </label>
        {students.map((student) => (
          <StudentCard key={student.NIM} student={student} />
        ))}
      </div>
      <button
        className="btn bg-blue-500 px-4 py-2 mt-5 inline-block font-bold text-white hide-on-print"
        onClick={handlePrintPDF}
        style={{ borderRadius: '6px', border: 'none' }}
      >
        Pilih data yang akan dicetak
      </button>

      <Modal isOpen={isPreviewOpen} onRequestClose={closePreview} contentLabel="Preview PDF">
        <div>
          <h2>Pilih Data yang Akan Dicetak</h2>
          <label>Pilih Ukuran Kertas:</label>
    <select onChange={handlePaperSizeChange} value={selectedPaperSize}>
      {paperSizes.map((size) => (
        <option key={size.value} value={size.value}>
          {size.name}
        </option>
      ))}
    </select>
          <button onClick={setPortraitOrientation}>Potret</button> {/* Tombol potret */}
          <button onClick={setLandscapeOrientation}>Lanskap</button> {/* Tombol lanskap */}
          <label>
            Margin Atas:
            <input
              type="number"
              value={margin.top}
              onChange={(e) => handleMarginChange('top', e.target.value)}
            />
          </label>
          <label>
            Margin Bawah:
            <input
              type="number"
              value={margin.bottom}
              onChange={(e) => handleMarginChange('bottom', e.target.value)}
            />
          </label>
          <label>
            Margin Kiri:
            <input
              type="number"
              value={margin.left}
              onChange={(e) => handleMarginChange('left', e.target.value)}
            />
          </label>
          <label>
            Margin Kanan:
            <input
              type="number"
              value={margin.right}
              onChange={(e) => handleMarginChange('right', e.target.value)}
            />
          </label>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Prodi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.NIM}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student)}
                      onChange={() => handleCheckboxChange(student)}
                    />
                  </td>
                  <td>{student.nama}</td>
                  <td>{student.NIM}</td>
                  <td>{student.Prodi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PDFViewer style={{ height: '100%', width: '100%' }}>
          <PDFDocument students={selectedStudents} paperType={selectedPaperSize} orientation={orientation} margin={margin} />
        </PDFViewer>
        <br />
        <PDFDownloadLink
          document={<PDFDocument students={selectedStudents} paperType={selectedPaperSize} orientation={orientation} margin={margin} />}
          fileName="daftar_mahasiswa.pdf"
        >
          {({ blob, url, loading, error }) => (loading ? 'Menghasilkan PDF...' : 'Unduh PDF')}
        </PDFDownloadLink>
        <br />
        <button onClick={closePreview}>Tutup</button>
      </Modal>
    </div>
  );
};

const PDFDocument = ({ students, paperType, orientation, margin }) => {
  const studentsPerPage = orientation === 'portrait' ? 20 : 15;
  const selectedPaperSize = paperType; // Menyamakan selectedPaperSize dengan paperType

  const divideStudentsIntoPages = () => {
    const pages = [];
    for (let i = 0; i < students.length; i += studentsPerPage) {
      pages.push(students.slice(i, i + studentsPerPage));
    }
    return pages;
  };

  const pages = divideStudentsIntoPages();

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page
          key={pageIndex}
          size={selectedPaperSize}
          orientation={orientation}
          style={{
            ...styles.page,
            marginTop: margin.top,
            marginBottom: margin.bottom,
            marginLeft: margin.left,
            marginRight: margin.right,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>KOP MARSTECH (KANTOR PUSAT)</Text>
          </View>
          <View style={{ ...styles.table, marginTop: 10 }}>
            <View style={{ ...styles.tableRow, backgroundColor: 'lightgray' }}>
              <Text style={{ ...styles.tableCell, backgroundColor: 'lightgray' }}>Nama</Text>
              <Text style={{ ...styles.tableCell, backgroundColor: 'lightgray' }}>NIM</Text>
              <Text style={{ ...styles.tableCell, backgroundColor: 'lightgray' }}>Prodi</Text>
            </View>
            {page.map((student, index) => (
              <View style={{ ...styles.tableRow, backgroundColor: 'white' }} key={index}>
                <Text style={{ ...styles.tableCell, backgroundColor: 'white' }}>{student.nama}</Text>
                <Text style={{ ...styles.tableCell, backgroundColor: 'white' }}>{student.NIM}</Text>
                <Text style={{ ...styles.tableCell, backgroundColor: 'white' }}>{student.Prodi}</Text>
              </View>
            ))}
          </View>
          {pageIndex === pages.length - 1 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Mengetahui,</Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};


export default StudentTable;
