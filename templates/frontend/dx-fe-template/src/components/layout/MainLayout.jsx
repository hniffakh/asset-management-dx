import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "sans-serif",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main
          style={{
            flex: 1,
            padding: "30px",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
