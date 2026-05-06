import Swal from "sweetalert2";

export const swalError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Oops 😢",
    text: message,
    confirmButtonColor: "#ec4899", // pink-500
    background: "#fff1f2", // soft pink bg
    color: "#be185d", // pink-700 text
  });
};

export const swalSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Yeay 💖",
    text: message,
    confirmButtonColor: "#ec4899",
    background: "#fff1f2",
    color: "#be185d",
  });
};

export const swalConfirm = async (message: string) => {
  return Swal.fire({
    title: "Kamu yakin? 🥺",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ec4899",
    cancelButtonColor: "#d1d5db",
    confirmButtonText: "Iya 💖",
    cancelButtonText: "Batal",
    background: "#fff1f2",
  });
};