  document.addEventListener("DOMContentLoaded", function() {
    const marginForm = document.getElementById("marginForm");
    const applyStylesBtn = document.getElementById("applyStyles");
    const selectAllBtn = document.getElementById("selectAll");
    const printSelectedBtn = document.getElementById("printSelected");
    const table = document.getElementById("dataTable");

    applyStylesBtn.addEventListener("click", function() {
      // console.log("stest");
      const marginTop = document.getElementById("marginTop").value + "mm";
      // const marginBottom = document.getElementById("marginBottom").value + "mm";
      const marginLeft = document.getElementById("marginLeft").value + "mm";
      // const marginRight = document.getElementById("marginRight").value + "mm";
      const tableWidth = document.getElementById("tableWidth").value + "mm";

      table.style.marginTop = marginTop;
      // table.style.marginBottom = marginBottom;
      table.style.marginLeft = marginLeft;
      // table.style.marginRight = marginRight;
      table.style.width = tableWidth;

      localStorage.setItem("marginTop", marginTop);
      // localStorage.setItem("marginBottom", marginBottom);
      localStorage.setItem("marginLeft", marginLeft);
      // localStorage.setItem("marginRight", marginRight);
      localStorage.setItem("tableWidth", tableWidth);
      
      // Menyimpan pengaturan ke sessionStorage
      sessionStorage.setItem("marginTop", marginTop);
      // sessionStorage.setItem("marginBottom", marginBottom);
      sessionStorage.setItem("marginLeft", marginLeft);
      // sessionStorage.setItem("marginRight", marginRight);
      sessionStorage.setItem("tableWidth", tableWidth);
    });

    printButton.addEventListener("click", function() {
      window.print(); // Cetak halaman saat tombol diclick
    });

    selectAllBtn.addEventListener("click", function() {
      const checkboxes = table.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
    });

    printSelectedBtn.addEventListener("click", function() {
      const selectedData = [];
      const checkboxes = table.querySelectorAll("input[type='checkbox']:checked");
      checkboxes.forEach(checkbox => {
        const row = checkbox.closest("tr");
        const nama = row.querySelector(".nama").textContent;
        const nim = row.querySelector(".nim").textContent;
        const prodi = row.querySelector(".prodi").textContent;
        selectedData.push({ nama, nim, prodi });
      });
    
      if (selectedData.length > 0) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>');
        // printWindow.document.write(`<style>body { margin: ${marginTop.value}mm ${marginRight.value}mm ${marginBottom.value}mm ${marginLeft.value}mm; width: ${tableWidth.value}mm; }</style>`);
        printWindow.document.write(`<style>body { margin: ${marginTop.value}mm 0mm 0mm ${marginLeft.value}mm; width: ${tableWidth.value}mm; }</style>`);
        printWindow.document.write(`<style>body { margin-top: ${marginTop.value}mm; margin-right: 0mm; margin-buttom: 0mm; margin-left ${marginLeft.value}mm; width: ${tableWidth.value}mm; }</style>`);
        printWindow.document.write('<body><table border="0"><tbody>');
        selectedData.forEach(mahasiswa => {
          printWindow.document.write(`<tr><td>${mahasiswa.nama}</td><td>${mahasiswa.nim}</td><td>${mahasiswa.prodi}</td></tr>`);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      } else {
        alert("Pilih setidaknya satu data untuk dicetak.");
      }
    });
    
      
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(mahasiswa => {
          const row = document.createElement('tr');
          
          const checkboxCell = document.createElement('td');
          const checkbox = document.createElement('input');
          checkbox.type = "checkbox";
          checkboxCell.appendChild(checkbox);
          
          const namaCell = document.createElement('td');
          namaCell.textContent = mahasiswa.nama;
          namaCell.classList.add("nama");
          
          const nimCell = document.createElement('td');
          nimCell.textContent = mahasiswa.nim;
          nimCell.classList.add("nim");
          
          const prodiCell = document.createElement('td');
          prodiCell.textContent = mahasiswa.prodi;
          prodiCell.classList.add("prodi");

          row.appendChild(checkboxCell);
          row.appendChild(namaCell);
          row.appendChild(nimCell);
          row.appendChild(prodiCell);

          document.getElementById('dataTable').querySelector('tbody').appendChild(row);
        });
      });
  });