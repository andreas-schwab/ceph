import { PageHelper } from '../page-helper.po';

export class NavigationPageHelper extends PageHelper {
  pages = {
    index: { url: '#/dashboard', id: 'cd-dashboard' }
  };

  navigations = [
    { menu: 'NFS', component: 'cd-error' },
    {
      menu: 'Object Gateway',
      submenus: [
        { menu: 'Daemons', component: 'cd-rgw-daemon-list' },
        { menu: 'Users', component: 'cd-rgw-user-list' },
        { menu: 'Buckets', component: 'cd-rgw-bucket-list' }
      ]
    },
    { menu: 'Dashboard', component: 'cd-dashboard' },
    {
      menu: 'Cluster',
      submenus: [
        { menu: 'Hosts', component: 'cd-hosts' },
        { menu: 'Physical Disks', component: 'cd-error' },
        { menu: 'Monitors', component: 'cd-monitor' },
        { menu: 'Services', component: 'cd-error' },
        { menu: 'OSDs', component: 'cd-osd-list' },
        { menu: 'Configuration', component: 'cd-configuration' },
        { menu: 'CRUSH map', component: 'cd-crushmap' },
        { menu: 'Manager Modules', component: 'cd-mgr-module-list' },
        { menu: 'Ceph Users', component: 'cd-crud-table' },
        { menu: 'Logs', component: 'cd-logs' },
        { menu: 'Alerts', component: 'cd-prometheus-tabs' }
      ]
    },
    { menu: 'Pools', component: 'cd-pool-list' },
    {
      menu: 'Block',
      submenus: [
        { menu: 'Images', component: 'cd-error' },
        { menu: 'Mirroring', component: 'cd-mirroring' },
        { menu: 'iSCSI', component: 'cd-iscsi' }
      ]
    },
    { menu: 'File Systems', component: 'cd-cephfs-list' }
  ];

  getVerticalMenu() {
    return cy.get('nav[id=sidebar]');
  }

  getMenuToggler() {
    return cy.get('[aria-label="toggle sidebar visibility"]');
  }

  checkNavigations(navs: any) {
    // The nfs-ganesha, RGW, and block/rbd status requests are mocked to ensure that this method runs in time
    cy.intercept('/ui-api/nfs-ganesha/status', { fixture: 'nfs-ganesha-status.json' });
    cy.intercept('/ui-api/rgw/status', { fixture: 'rgw-status.json' });
    cy.intercept('/ui-api/block/rbd/status', { fixture: 'block-rbd-status.json' });

    navs.forEach((nav: any) => {
      cy.contains('.simplebar-content li.nav-item a', nav.menu).click();
      if (nav.submenus) {
        this.checkNavSubMenu(nav.menu, nav.submenus);
      } else {
        cy.get(nav.component).should('exist');
      }
    });
  }

  checkNavSubMenu(menu: any, submenu: any) {
    submenu.forEach((nav: any) => {
      cy.contains('.simplebar-content li.nav-item', menu).within(() => {
        cy.contains(`ul.list-unstyled li a`, nav.menu).click();
      });
    });
  }
}
