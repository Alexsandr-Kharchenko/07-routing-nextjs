import './globals.css';
import '../app/Home.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

export const metadata = {
  title: 'NoteHub',
  description: 'Manage your notes efficiently',
};

// ✅ Додаємо `modal` як слот для паралельного маршруту @modal
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />

          {/* ✅ Місце, куди Next.js буде вставляти твій @modal */}
          {modal}

          {/* старий div можна залишити або прибрати */}
          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}
