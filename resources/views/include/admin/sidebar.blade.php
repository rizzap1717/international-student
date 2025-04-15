<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
        <a href="{{ url('/') }}" class="app-brand-link">
            <img src="{{ asset('admin/assets/img/logo/trace.svg') }}" alt="">
            <span class="app-brand-text demo menu-text fw-bolder ms-1">International</span>
        </a>

        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
            <i class="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
        <!-- Dashboard -->
        <li class="menu-item {{ url()->current() == route('home') ? 'active' : '' }}">
            <a href="{{ route('home') }}" class="menu-link">
                <i class="menu-icon tf-icons bx bx-bar-chart-alt-2"></i>
                <div data-i18n="Analytics">Dashboard</div>
            </a>
        </li>

        <li class="menu-header small text-uppercase">
            <span class="menu-header-text">Admin Menu</span>
        </li>
        <li
            class="menu-item {{ request()->routeIs('lecture.*') || request()->routeIs('faculties.*') || request()->routeIs('StudyProgram.*') ? 'active menu-open' : '' }}">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
                <i class="menu-icon tmenu-icon tf-icons bx bx-user-pin" class="menu-item "></i>
                <div data-i18n="Authentications">Academic</div>
            </a>
            <ul  class="menu-sub {{ request()->routeIs('faculties.*') ? 'active' : '' }}">
                <a href="{{ route('faculties.index') }}" class="menu-link">
                    <i class="menu-icon bx bx-building"></i>
                    <div data-i18n="Faculties">Faculties</div>
                </a>
            </ul>
            <ul class="menu-sub {{ request()->routeIs('StudyProgram*') ? 'active' : '' }}"> 
                <a href="{{ route('StudyProgram.index') }}" class="menu-link">
                    <i class="menu-icon bx bx-book"></i>
                    <div data-i18n="Faculties">Study Program</div>
                </a>
                
            </ul>
        </li>
        <li
        class="menu-item {{ request()->routeIs('profil.*') || request()->routeIs('accreditation.*') || request()->routeIs('achievement.*') ? 'active menu-open' : '' }}">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
            <i class="menu-icon bx bx-user"></i>
            <div data-i18n="Authentications">Profile</div>
        </a>
            <ul class="menu-sub">
                <li class="menu-item {{ request()->routeIs('profile.index') ? 'active' : '' }}">
                    <a href="{{ route('profile.index') }}" class="menu-link">
                        <div data-i18n="Basic">Vision Mision</div>
                    </a>
                </li>
                <li class="menu-item {{ request()->routeIs('accreditation.index') ? 'active' : '' }}">
                    <a href="{{ route('accreditation.index') }}" class="menu-link">
                        <div data-i18n="Basic">Accreditation</div>
                    </a>
                </li>
                <li class="menu-item {{ request()->routeIs('achievement.index') ? 'active' : '' }}">
                    <a href="{{ route('achievement.index') }}" class="menu-link">
                        <div data-i18n="Basic">Achivement</div>
                    </a>
                </li>
            </ul>
        </li>
        <li class="menu-item {{ url()->current() == route('structure.index') ? 'active' : '' }}">
            <a href="{{ route('structure.index') }}" class="menu-link">
                <i class='menu-icon bx bx-library'></i>
                <div data-i18n="Analytics">Structure</div>
            </a>
        </li>

        <li class="menu-header small text-uppercase">
            <span class="menu-header-text">Menu User</span>
        </li>
        <li class="menu-item {{ url()->current() == route('news.index') ? 'active' : '' }}">
            <a href="{{ route('news.index') }}" class="menu-link">
                <i class="menu-icon tf-icons bx bx-news"></i>
                <div data-i18n="Analytics">News</div>
            </a>
        </li>

    </ul>
</aside>
