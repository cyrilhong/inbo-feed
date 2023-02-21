import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default async function downloadComponentInPDF(Component) {
  await html2canvas(Component).then((canvas) => {
    const componentWidth = Component.offsetWidth
    const componentHeight = Component.offsetHeight

    const orientation = componentWidth >= componentHeight ? 'l' : 'p'

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation,
      unit: 'px'
    })

    pdf.internal.pageSize.width = componentWidth
    pdf.internal.pageSize.height = componentHeight

    pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
    
    pdf.save('download.pdf')
  })
}