import { useNavigate } from "react-router-dom";

const Paymenterror = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full bg-white shadow-xl rounded-3xl p-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center space-y-6">

          <h1 className="text-4xl font-extrabold text-red-600">
            Payment Unsuccessful
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Unfortunately your payment could not be processed. We’re sorry for
            the inconvenience. Please try again or contact support if the issue
            persists.
          </p>

          <button
            onClick={() => navigate("/subscriptions")}
            className="w-fit bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Back to Subscriptions
          </button>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center">

          <img
            src="https://cdn.dribbble.com/userupload/42295887/file/original-2e27796737e975dc1e453c3b72df2a3d.gif"
            alt="Payment Failed"
            className="max-h-[320px] object-contain"
          />

        </div>

      </div>

    </div>
  );
};

export default Paymenterror;