<div class="hide-menu a-nav-toggle"></div>
<div class="menu">
    <div class="">
        <button class="nav-toggle-btn a-nav-toggle d-md-none">
            <span class="nav-toggle nav-toggle-sm">
                <span class="stick stick-1"></span>
                <span class="stick stick-2"></span>
                <span class="stick stick-3"></span>
            </span>
        </button>
    </div>
    <div class="menu-main" id="accordion">
        @php
        echo menu('nfs', 'mobilemenu')
        @endphp
    </div>
    <div class="menu-footer">
        <div class="menu-copyright">&copy; 2020</div>
    </div>
</div>
