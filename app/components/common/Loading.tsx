export default function Loading() {
    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-gray-100/70">
            {/* <Image src="/loading.svg" alt="Loading" width={64} height={64} /> */}
            <div className="animate-spin stroke-brand-500 text-gray-200 dark:text-gray-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="100"
                    height="100"
                    className="animate-spin"
                    shapeRendering="crispEdges"
                >
                    <rect x="11" y="2" width="2" height="2" fill="#ec4899" />     {/* atas */}
                    <rect x="17" y="4" width="2" height="2" fill="#ec4899" />     {/* kanan atas */}
                    <rect x="20" y="10" width="2" height="2" fill="#ec4899" />    {/* kanan */}
                    <rect x="17" y="16" width="2" height="2" fill="#ec4899" />    {/* kanan bawah */}
                    <rect x="11" y="20" width="2" height="2" fill="#ec4899" />    {/* bawah */}
                    <rect x="5" y="16" width="2" height="2" fill="#ec4899" />     {/* kiri bawah */}
                    <rect x="2" y="10" width="2" height="2" fill="#ec4899" />     {/* kiri */}
                    <rect x="5" y="4" width="2" height="2" fill="#ec4899" />      {/* kiri atas */}
                </svg>

            </div>
        </div>
    );
}
