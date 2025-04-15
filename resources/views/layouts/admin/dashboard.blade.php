<!DOCTYPE html>
<html lang="en" class="light-style layout-menu-fixed" dir="ltr" data-theme="theme-default"
    data-assets-path="assets/" data-template="vertical-menu-template-free">

<head>
    <meta charset="utf-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Piksi CMS</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('admin/assets/img/favicon/logo.png') }}" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet" />

    <!-- Icons. Uncomment required icon fonts -->
    <link rel="stylesheet" href="{{ asset('admin/assets/vendor/fonts/boxicons.css') }}" />

    <!-- Core CSS -->
    <link rel="stylesheet" href="{{ asset('admin/assets/vendor/css/core.css') }}"
        class="template-customizer-core-css" />
    <link rel="stylesheet" href="{{ asset('admin/assets/vendor/css/theme-default.css') }}"
        class="template-customizer-theme-css" />
    <link rel="stylesheet" href="{{ asset('admin/assets/css/demo.css') }}" />

    <!-- Vendors CSS -->
    <link rel="stylesheet" href="{{ asset('admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css') }}" />

    <link rel="stylesheet" href="{{ asset('admin/assets/vendor/libs/apex-charts/apex-charts.css') }}" />

    <!-- Page CSS -->

    <!-- Helpers -->
    <script src="{{ asset('admin/assets/vendor/js/helpers.js') }}"></script>

    <script src="{{ asset('admin/assets/js/config.js') }}"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="https://cdn.datatables.net/2.1.8/css/dataTables.bootstrap5.css">

    <style>
        .toast-container {
            z-index: 9999 !important;
        }
    </style>

    @stack('css')
</head>

<body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <!-- BAGIAN SIDEBAR -->

            @include('include.admin.sidebar')

            <!-- / BAGIAN SIDEBAR -->

            <!-- Layout container -->
            <div class="layout-page">
                <!-- INI BAGIAN HEADER -->

                @include('include.admin.navbar')

                <!-- / INI BAGIAN HEADER -->

                <!-- Content wrapper -->
                <div class="content-wrapper">
                    <!-- Content -->
                    @yield('content')

                    {{-- UNTUK TOAST NOTIFIKASI --}}
                    <div class="toast-container position-fixed top-0 end-0 p-3">
                        <div id="validationToast" class="toast hide" role="alert" aria-live="assertive"
                            aria-atomic="true">
                            <div class="toast-header">
                                <i class="bi bi-cloud-arrow-up-fill me-2"></i>
                                <div class="me-auto fw-semibold">Error</div>
                                <small>Just Now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                Data Tidak Valid!
                            </div>
                        </div>
                    </div>


                    <!-- Toast Untuk Success -->
                    @if (session('success'))
                        <div class="bs-toast toast toast-placement-ex m-2 bg-success top-0 end-0 fade show toast-custom"
                            role="alert" aria-live="assertive" aria-atomic="true" id="toastSuccess">
                            <div class="toast-header">
                                <i class="bi bi-check-circle me-2"></i>
                                <div class="me-auto fw-semibold">Success</div>
                                <small>Just Now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                {{ session('success') }}
                            </div>
                        </div>
                    @endif

                    {{-- Toast Untuk Error --}}
                    @if (session('error'))
                        <div class="bs-toast toast toast-placement-ex m-2 bg-danger top-0 end-0 fade show toast-custom"
                            role="alert" aria-live="assertive" aria-atomic="true" id="toastError">
                            <div class="toast-header">
                                <i class="bx bx-error me-2"></i>
                                <div class="me-auto fw-semibold">Error</div>
                                <small>Just Now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                {{ session('error') }}
                            </div>
                        </div>
                    @endif


                    {{-- Toast Untuk Danger --}}
                    {{-- Toast Untuk Danger --}}
                    @if (session('danger'))
                        <div class="bs-toast toast toast-placement-ex m-2 bg-danger top-0 end-0 fade toast-custom"
                            role="alert" aria-live="assertive" aria-atomic="true" id="toastDanger">

                            <div class="toast-header">
                                <i class="bx bx-error me-2"></i>
                                <div class="me-auto fw-semibold">Danger</div>
                                <small>Just Now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                {{ session('danger') }}
                            </div>
                        </div>
                    @endif


                    {{-- Toast Untuk Warning --}}
                    @if (session('warning'))
                        <div class="bs-toast toast toast-placement-ex m-2 bg-warning top-0 end-0 fade toast-custom"
                            role="alert" aria-live="assertive" aria-atomic="true" id="toastWarning">

                            <div class="toast-header">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                <div class="me-auto fw-semibold">Warning</div>
                                <small>Just Now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                {{ session('warning') }}
                            </div>
                        </div>
                    @endif

                    <!-- / Content -->

                    <!-- Footer -->
                    @include('include.admin.footer')
                    <!-- / Footer -->
                </div>
                <!-- Content wrapper -->
            </div>
            <!-- / Layout page -->
        </div>

        <!-- Overlay -->
        <div class="layout-overlay layout-menu-toggle"></div>
    </div>
    <!-- / Layout wrapper -->
    <!-- Core JS -->
    <!-- build:js assets/vendor/js/core.js -->
    <script src="{{ asset('admin/assets/vendor/libs/jquery/jquery.js') }}"></script>
    <script src="{{ asset('admin/assets/vendor/libs/popper/popper.js') }}"></script>
    <script src="{{ asset('admin/assets/vendor/js/bootstrap.js') }}"></script>
    <script src="{{ asset('admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js') }}"></script>

    <script src="{{ asset('admin/assets/vendor/js/menu.js') }}"></script>
    <!-- endbuild -->

    <!-- Vendors JS -->
    <script src="{{ asset('admin/assets/vendor/libs/apex-charts/apexcharts.js') }}"></script>

    <!-- Main JS -->
    <script src="{{ asset('admin/assets/js/main.js') }}"></script>

    <!-- Page JS -->
    <script src="{{ asset('admin/assets/js/dashboards-analytics.js') }}"></script>

    <!-- Place this tag in your head or just before your close body tag. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    @include('sweetalert::alert')

    @stack('scripts')

    {{-- UNTUk TOAST 2 DETIK --}}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toastSuccess = document.getElementById('toastSuccess');
            const toastError = document.getElementById('toastError');

            if (toastSuccess) {
                setTimeout(function() {
                    toastSuccess.classList.add('toast-hide');
                }, 2000);
            }

            if (toastError) {
                setTimeout(function() {
                    toastError.classList.add('toast-hide');
                }, 2000);
            }
        });
    </script>


    {{-- UNTUK TOAST NOTIFIKASI VALIDASI --}}
    @isset($errors)
    @if ($errors->any())
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                var toastEl = document.getElementById('validationToast');
                var toast = new bootstrap.Toast(toastEl, {
                    delay: 2000
                });
                toast.show();

                toastEl.addEventListener('hidden.bs.toast', function() {
                    toastEl.classList.add('hide'); // Tambahkan kelas hide untuk animasi keluar
                });

                setTimeout(function() {
                    toastEl.classList.remove('hide');
                }, 2000); // Waktu 2 detik sebelum menghapus kelas hide
            });
        </script>
    @endif
@endisset


    {{-- UNTUK CONFIRM DELETE --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function confirmDelete(id) {
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form-' + id).submit();
                }
            });
        }
    </script>


    {{-- UNTUK SIDEBAR --}}
    <script>
        // Sidebar aktif otomatis
        document.addEventListener('DOMContentLoaded', function() {
            const currentUrl = window.location.href;
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                const route = item.getAttribute('data-route');
                if (currentUrl.includes(route)) {
                    item.classList.add('active');
                }
            });
        });
    </script>

</body>

</html>
