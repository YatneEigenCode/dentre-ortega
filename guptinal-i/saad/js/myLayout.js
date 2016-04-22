//4-15-2016 JChoy call smartCols()
new MyPageApp().start(document.forms[0]);

var plm= new PortalsLayout().getPortalsMgr();
plm.smartCols();
plm.addPortal( new QuikLinks() ).start( plm.getAvailCell(), "data/quiklink102.txt");
plm.addPortal( new ScratchApp() ).start( plm.getAvailCell(), "scratchpad");
plm.addPortal( new QuikNote() ).start( plm.getAvailCell(), "data/quiknote125.txt" );
 plm.addPortal( new DomMvApp() ).start( plm.getAvailCell(), "fm101");
 plm.addPortal( new StubApp() ).start( plm.getAvailCell(), "clock "+new Date());
plm.addPortal( new QuikHtml() ).start( plm.getAvailCell(), "data/quikhtml121.txt");

//plm.addPortal( new LogApp() ).start( plm.getAvailCell() );
(function(toc,cl,a,plm){if(toc!='undefined')plm.addPortal(new cl()).start(plm.getAvailCell(),a)
})( typeof LogApp, LogApp, "", new PortalsLayout().getPortalsMgr() );

