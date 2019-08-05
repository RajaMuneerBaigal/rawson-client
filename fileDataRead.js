//Read file data
var av = av || {};  //incase av already exists
var dijit = dijit || {};  //incase av already exists


av.fio.addFzItem = function(dndSection, name, type, fileNum) {
  'use strict';
  var domid;
  if (undefined != dndSection) {
    //var items = av.dnd.getAllItems(av.dnd.activeOrgan);
    //console.log('name=',name,'; items=',items);
    //var nodes = dndSection.getAllNodes();
    //console.log('name=',name,'; nodes=',nodes); 
    var names = [];
    var domItems = Object.keys(dndSection.map);
    var lngth = domItems.length;
    
    if (false) {
    //if (0 < lngth) {
      //trying to figure out sorting 
      for (var ii = 0; ii < lngth; ii++) {
        names[ii] = dndSection.map[domItems[ii]].data;
      };
      
    }
    else {
      dndSection.insertNodes(false, [{data: name, type: [type]}]);
      dndSection.sync();
      var mapItems = Object.keys(dndSection.map);
      domid = mapItems[mapItems.length - 1];
    };
    
    //var domID = av.dnd.getDomId(configName, target);
    

    if (av.debug.fio) console.log('fileNum=', fileNum, '; name=', name, '; Section=', dndSection.node.id);
    //console.log('fileNum', fileNum, '; name', name, '; Section', dndSection.node.id, '; type', type);

    //create a right av.mouse-click context menu for the item just created.
    if (0 < fileNum) {
      av.dnd.contextMenu(dndSection, domid, 'av.fio.addFzItem');
    }
    return domid;
  }
  else {
    console.log('dndSection=', dndSection, '; name=', name, '; type=', type, '; fileNum=', fileNum);
    return 'dndSection is undefined';
  }
};

av.fio.setActiveConfig = function(dndSection, name, type){
  'use strict';
  if (av.debug.fio)  console.log('name=', name);
  av.dnd.activeConfig.selectAll().deleteSelectedNodes();
  av.dnd.activeConfig.insertNodes(false, [{data: name, type: [type]}]);
  av.dnd.activeConfig.sync();
  var mapItems = Object.keys(dndSection.map);
  av.fzr.actConfig.fzDomid = mapItems[mapItems.length - 1];  //domid from freezer. not sure if this is used.
  mapItems = Object.keys(av.dnd.activeConfig.map);
  av.fzr.actConfig.actDomid = mapItems[0];    //domid from active config.  this is used in changing cursor shape
  av.fzr.actConfig.name = name;
  av.fzr.actConfig.type = type;
  return av.fzr.actConfig.actDomid;
};

av.frd.add2freezerFromFile = function (loadConfigFlag) {
  'use strict';
  var type = av.fio.anID.substr(0, 1);
  //console.log('av.fio.anID', av.fio.anID);
  var dir = wsb('/', av.fio.anID);
  var num = dir.substr(1, dir.length-1);
  var name, domid;
  //console.log('av.fio.thisfile.asText()', av.fio.thisfile.asText());
  //console.log('av.fio.thisfile', av.fio.thisfile);
  if (null == av.fio.thisfile.asText()) { name = av.fio.anID; }
  else { name = wsb('\n', av.fio.thisfile.asText()); }

  //if (av.debug.fio) console.log('type ', type, '; dir', dir, '; num', num);
  
  switch (type) {
    case 'c':
      domid = av.fio.addFzItem(av.dnd.fzConfig, name, type, num);
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzConfig is undefined');
      if (av.fzr.cNum < Number(num)) {av.fzr.cNum = Number(num); }
      //console.log('c: num', num, '; name', name, 'flag', loadConfigFlag);
      if (0 == num && loadConfigFlag) {var ConfigActiveDomID = av.fio.setActiveConfig(av.dnd.activeConfig, name, 'b');}
      break;
    case 'g':
      domid = av.fio.addFzItem(av.dnd.fzOrgan, name, type, num);
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzOrgan is undefined');
      if (av.fzr.gNum < Number(num)) {av.fzr.gNum = Number(num); }
      break;
/*
    case 'm':
      domid = av.fio.addFzItem(av.dnd.fzMdish, name, type, num);
      av.fzr.mDish[dir] = {};
      av.fzr.mDish[dir].dir = {};
      av.fzr.mDish[dir].domid = {};
      av.fzr.mDish[dir].cNum = -1;
      av.fzr.mDish[dir].wNum = -1;
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzMdish is undefined------------------------------');
      if (av.fzr.mNum < Number(num)) {av.fzr.mNum = Number(num); }
      break;
    case 'r':
      domid = av.fio.addFzItem(av.dnd.fzRdish, name, type, num);
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzrDish is undefined');
      if (av.fzr.rNum < Number(num)) {av.fzr.rNum = Number(num); }
      break;
*/
    case 't':
      domid = av.fio.addFzItem(av.dnd.fzTdish, name, type, num);
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzTdish is undefined');
      if (av.fzr.tNum < Number(num)) {av.fzr.tNum = Number(num); }
      break;
    case 'w':
      domid = av.fio.addFzItem(av.dnd.fzWorld, name, type, num);
      if ('dndSection is undefined' == domid) console.log('av.dnd.fzWorld is undefined');
      if (av.fzr.wNum < Number(num)) {av.fzr.wNum = Number(num); }
      break;
  }
  av.fzr.file[av.fio.anID] = name;
  av.fzr.domid[dir] = domid;
  av.fzr.dir[domid] = dir;
}

av.frd.add2multiDishFromFile = function(){
  "use strict";
  //console.log(from, ' called av.frd.add2multiDishFromFile');
  console.log('av.fio.fName', av.fio.fName, '; av.fio.anID', av.fio.anID, '; av.fzr.fziType=',av.fzr.fziType);
  var multiDish = wsb('/', av.fio.anID);
  var superNum = multiDish.substr(1, multiDish.length-1);
  var firstIndex = av.fio.anID.indexOf('/');
  var lastIndex = av.fio.anID.lastIndexOf('/');
  var length = lastIndex - firstIndex - 1;
  console.log('firstI=', firstIndex, ';  lastI=', lastIndex);
  var subDish = av.fio.anID.substr(firstIndex+1, length);
  var type = subDish.substr(0,1);
  var subNum = subDish.substr(1, subDish.length-1);
  switch (type) {
    case 'c':
      if (av.fzr.mDish[multiDish].cNum < Number(subNum)) {av.fzr.mDish[multiDish].cNum = Number(subNum); }
      break;
    case 'w':
      if (av.fzr.mDish[multiDish].wNum < Number(subNum)) {av.fzr.mDish[multiDish].wNum = Number(subNum); }
      break;
  }
  av.fzr.mDish[multiDish].domid[subDish] = subNum;  //eventually subNum will be a domid, but we are not building the editing interface yet.
  av.fzr.mDish[multiDish].dir[subNum] = subDish;

  console.log('multiDish=', multiDish, '; superNum=', superNum, '; subDish=', subDish, '; subNum=', subNum, '; type=', type, 'wNum=', av.fzr.mDish[multiDish].wNum);
};

av.frd.processSubDish = function() {
  "use strict";
  console.log('SubDish:', av.fzr.fziType, ';  ID=', av.fio.anID);
};

av.fio.processFiles = function (loadConfigFlag){
  'use strict';
  var fileType = av.fio.anID;
  if ('subDish' === av.fzr.fziType){
    fileType = wsa('/', fileType);
    //av.frd.processSubDish();
  }
  fileType = wsa('/', fileType);
  //if (av.debug.fio) console.log('anID=', av.fio.anID, '; fileType=', fileType, '; fziType=', av.fzr.fziType);
    switch (fileType) {
      case 'entryname.txt':
        // only for dealing with the multi-dish section
        if ('subDish' != av.fzr.fziType) {
          av.frd.add2freezerFromFile(loadConfigFlag);
          av.fzr.usrFileLoaded = true;
        }
        else {
          av.frd.add2multiDishFromFile();
        }
      case 'ancestors':
      case 'ancestors_manual':
      case 'ancestors.txt':
      case 'ancestors_manual.txt':
      case 'avida.cfg':
      case 'clade.ssg':
      case 'detail.spop':
      case 'environment.cfg':
      case 'events.cfg':
      case 'genome.seq':
      case 'instset.cfg':
      case 'offset.txt':
      case 'timeRecorder.csv':
      case 'tr0':
      case 'tr1':
      case 'tr2':
      case 'tr3':
      case 'tr4':
      case 'update':
        // deal with multidish 
        if (loadConfigFlag) {
          if ('c0/avida.cfg' == av.fio.anID) {
            av.frd.avidaCFG2form(av.fio.thisfile.asText());
          }
          if ('c0/environment.cfg' == av.fio.anID) {
            av.frd.environmentCFG2form(av.fio.thisfile.asText().trim());
          }
        }
        //Process dishes with ancesotrs. 
        if ('ancestors' == fileType || 'ancestors_manual' == fileType) {
          av.fio.anID = av.fio.anID + '.txt';
        }
        //put the text of the file in the freezer
        av.fzr.file[av.fio.anID] = av.fio.thisfile.asText().trim();
        //if (av.debug.fio) console.log('FileType is ', fileType, '; filepath = ', av.fio.anID);
        break;
      default:
        //if (av.debug.fio) console.log('undefined file type in zip: full ', av.fio.fName, '; id ', av.fio.anID, '; type ', fileType);
        break;

    //if (av.debug.fio) console.log('file type in zip: fname ', av.fio.fName, '; id ', av.fio.anID, '; type ', fileType);
    //console.log('file type in zip: fname ', av.fio.fName, '; id ', av.fio.anID, '; type ', fileType);
  }
};

av.fio.processItemFiles = function (){
  'use strict';
  switch (av.fio.anID) {
    case 'entryname.txt':
    case 'entrytype.txt':
    case 'ancestors':
    case 'ancestors_manual':
    case 'ancestors.txt':
    case 'ancestors_manual.txt':
    case 'avida.cfg':
    case 'clade.ssg':
    case 'detail.spop':
    case 'environment.cfg':
    case 'events.cfg':
    case 'genome.seq':
    case 'instset.cfg':
    case 'timeRecorder.csv':
    case 'tr0':
    case 'tr1':
    case 'tr2':
    case 'tr3':
    case 'tr4':
    case 'update':
      if ('ancestors' == av.fio.anID ||'ancestors_manual' == av.fio.anID) {
        av.fio.anID = av.fio.anID + '.txt';
      }
      av.fzr.item[av.fio.anID] = av.fio.thisfile.asText().trim();
      break;
    default:
      if (av.debug.fio) console.log('undefined file type in zip: full ', av.fio.fName, '; id ', av.fio.anID);
      break;
  }
};
//======================================================================================================================

//------------------------------------------ update config data from file data stored in freezer = av.frd.updateSetup --
av.frd.updateSetup = function(from) {
  'use strict';
  console.log(from, 'called av.frd.updateSetup; dir=', av.fzr.actConfig.dir);
  var dir = av.fzr.actConfig.dir;
  var path = dir + '/avida.cfg';
  var doctext = av.fzr.file[path];
  //console.log('actConfig: path=', path);
  
  av.frd.avidaCFG2form(doctext);
  doctext = av.fzr.file[dir + '/environment.cfg'];
  //av.frd.environmentCFG2form(doctext);
  av.frd.environment2struct(doctext);      //puts environment in a structure

  doctext = av.fzr.file[dir + '/pauseRunAt.txt'];
  av.frd.pauseRunAtTXT2form(doctext);
};
//----------------------------------------------------------------------------------------- end of av.frd.updateSetup --

//------------------------------------------- update config data from file data stored in freezer for test setup page --
av.frd.updateTestSetup = function (from) {
  'use strict';
  //console.log(from, ' called av.frd.updateTestSetup; dir=', dir);
  var dir = av.fzr.actConfig.dir;
  var path = dir + '/avida.cfg';
  var doctext = av.fzr.file[path];
  //console.log('actConfig: path=', path);
  
  av.frd.avidaTestform(doctext);         //av.frd.avidaCFG2form(doctext);
  doctext = av.fzr.file[dir + '/environment.cfg'];
  av.frd.environment2struct(doctext);     
  //av.frd.environmentTestform(doctext);     //for now editing the whole file
  //console.log('av.dom.environConfigEdit=',av.dom.environConfigEdit);

  if (av.fzr.file[av.dnd.move.dir+'/'+ 'environment.cfg'] ) {
    av.dom.environConfigEdit.value = av.fzr.file[av.dnd.move.dir+'/'+'environment.cfg'];
  };
  
  
  //doctext = av.fzr.file[dir + '/environment.cfg'];
  
  //not sure about this one; may need a test version of this one too
  //doctext = av.fzr.file[dir + '/pauseRunAt.txt'];
  //av.frd.pauseRunAtTest2form(doctext);
};
//------------------------------------------------------------------------------------- end of av.frd.updateTestSetup --

//--------------------------- section to put data from environment.cfg into setup traditional form of population page --
av.frd.environmentCFGlineParse = function(instr){
  'use strict';
  var num = 0;
  var flag = true;
  //console.log('instr', instr);
  var cfgary = av.utl.flexsplit(instr).split(',');      //replaces white space with a comma, then splits on comma
  //console.log('cfgary = ', cfgary);
  if (0 < cfgary[3].length) {num = wsb(':',wsa('=',cfgary[3]));}
  if (0 == num) {flag = false;} //use == in this case as they are of different type
  //if (av.debug.fio) console.log('flag', flag, '; num', num, '; cfgary', cfgary[3], '; instr', instr);
  //console.log('flag', flag, '; num', num, '; cfgary', cfgary[3], '; instr', instr);
  var rslt = {
    name : cfgary[1],
    value : flag
  };
  return rslt;
};

// makes a dictionary out of a environment.cfg file
av.frd.environmentCFGparse = function (filestr) {
  'use strict';
  var rslt = {};
  var lineobj;
  var lines = filestr.split('\n');
  var lngth = lines.length;
  for (var ii = 0; ii < lngth; ii++) {
    if (3 < lines[ii].length) {
      //console.log("lines[", ii, "]=", lines[ii]);
      lineobj = av.frd.environmentCFGlineParse(lines[ii]);
      rslt[lineobj.name.toUpperCase()] = lineobj.value;
    }
  } // for
  return rslt;
};

// puts data from the environment.cfg into the setup form for the population page
av.frd.environmentCFG2form = function (fileStr) {
  'use strict';
  var dict = av.frd.environmentCFGparse(fileStr);
  //console.log('av.frd.environmentCFG2form; dict=',dict);
  
  
  /*
  dijit.byId('notose').set('checked', dict.NOT);
  dijit.byId('nanose').set('checked', dict.NAND);
  dijit.byId('andose').set('checked', dict.AND);
  dijit.byId('ornose').set('checked', dict.ORN);
  dijit.byId('orose').set('checked', dict.OR);
  dijit.byId('andnose').set('checked', dict.ANDN);
  dijit.byId('norose').set('checked', dict.NOR);
  dijit.byId('xorose').set('checked', dict.XOR);
  dijit.byId('equose').set('checked', dict.EQU);
  */
};
//--------------------- end ofsection to put data from environment.cfg into setup traditional form of population page --

//----------------------------------------------- section to put data from environment.cfg into environment Structure --

av.frd.rNameIndex = function(avfzrenvLog, rtag) {
  /*
   * 
   * @param avfzrenv =  the suboabject of av.fzr.env that holds the arrays for logic9 type
   * @param rtag       the string that we are looking for. If the string is found data will be over written. 
   *                     if not, create a new entry in the arrays
   * @returns {Int}
   * 
   * Look for rtag in structure
   * return its index if it exists
   * return length + 1 is it does not exist
   */
  //console.log('avfzrenvLog=',avfzrenvLog);
  var defaultindex = avfzrenvLog.name.length;
  //console.log('defaultindex='defaultindex);
  var found = avfzrenvLog.name.indexOf(rtag);
  
  if (-1 < found) {
    //console.log('The name ', rtag, ' was found already in av.fzr.env subobject=',avfzrenvLog.name);
    return found;
  } 
  
  return defaultindex;  
};

av.frd.reactionLineParse = function(lnArray) {
  'use strict';
  var lnError = 'none';     //was it a valid line wihtout errors
  //console.log('lnArray = ', lnArray);
  var pear = [];
  var nn;
  //find logic type
  //console.log('task = lnArray[2]=',lnArray[2]);
  var logicindex = av.sgr.logicVnames.indexOf( lnArray[2] );   //task name
  //console.log('logicindex=',logicindex);
  if (-1 < logicindex) {
    var logtype = av.sgr.logEdNames[logicindex];
    // Checking for a resource tag
    //console.log('logtype=', logtype);
    var envobj = av.fzr.env.react[logtype];   //objec based on logic type and reaction;
    var ndx = av.frd.rNameIndex(envobj, lnArray[1]);
    //assin the name of the resource. 
    envobj.name[ndx] = lnArray[1];
    // assign default values are from https://github.com/devosoft/avida/wiki/Environment-file with constants for Avida-ED
    envobj.depletable[ndx] = 0;
    envobj.value[ndx] = 1;
    envobj.min[ndx] = 0.9;
    envobj.max[ndx] = 1.1;
    envobj.max_count[ndx] = 1; 
    envobj.task[ndx] = lnArray[2];
    envobj.resource[ndx] = envobj.name[ndx];
    envobj.type[ndx] = 'pow';
 
    var len;
    var lngth = lnArray.length;
    //console.log('ndx=',ndx, '; name=lnArray[1]=',lnArray[1],'; task=',lnArray[2], '; logtype=', logtype, '; lnArray.length=', lnArray.length);
    for (var jj=3; jj<lngth ;jj++) {
      var pairArray = lnArray[jj].split(':');    //this should get process
      len = pairArray.length;    
      //console.log('len=',len,'; pairArray=',pairArray);
      for (var ii=1; ii < len; ii++) {
        pear = pairArray[ii].split('=');
        //console.log('React: ii=',ii,'; pear', pear);
        nn = av.fzr.env.react_param.indexOf(pear[0].toLowerCase());
        if (-1 < nn) {
          envobj[av.fzr.env.react_param[nn]][ndx] = pear[1];
        }
        else {
          if ('cellbox' == pear[0].toLowerCase()) {
            console.log('cellbox is not a reacion; this should never write')
            cellboxdata = pear[1].split('|');
            //console.log('cellboxdata=',cellboxdata);
            //envobj.boxflag[ndx] = true;
            envobj.boxx[ndx] = cellboxdata[0];
            envobj.boxy[ndx] = cellboxdata[1];
            envobj.boxcol[ndx] = cellboxdata[2];
            envobj.boxrow[ndx] = cellboxdata[3];
          }
          else {
            lnError = 'leftside, '+pear[0]+' is not a valid reaction keyword. lnArray = '+lnArray;
            //console.log(lnError);
          }
        }
      }
    };
    //console.log('logtype=', logtype,'ndx=',ndx,'envobj=', envobj);
  }  
  // valid logic name not found;
  else {
    lnError = 'react task, '+ lnArray[2]+' not found in av.sgr.logicVnames';
  };
    
  return lnError;
};

av.frd.resourceLineParse = function(lnArray){
  'use strict';
  var lineErrors = 'none';  //was it a valid line wihtout errors
  //console.log('lnArray = ', lnArray);
  var pairArray = lnArray[1].split(':');
  var pear = [];
  var cellboxdata = [];
  var nn;
  var codes;  
  //console.log('pairArray=', pairArray);
  //find logic type
  var logicindex = av.sgr.logicNames.indexOf( pairArray[0].substring(0,3) );
  //console.log('logicindex=',logicindex);
  if (-1 < logicindex) {
    var logtype = av.sgr.logEdNames[logicindex];
    // Checking for a resource tag
    var envobj = av.fzr.env.rsrce[logtype];
    //console.log('logtype='+logtype,'; envobj=', envobj);
    var ndx = av.frd.rNameIndex(envobj, pairArray[0]);
    //console.log('ndx=',ndx);
    //assin the name of the resource. 
    envobj.name[ndx] = pairArray[0];
    // assign default values are from https://github.com/devosoft/avida/wiki/Environment-file witha few exceptions
    // boxflag is false indicating there are no box values. 
    // in Avida-ED, geometry=grid; 
    //console.log('av.fzr.env=', av.fzr.env);
    //console.log('envobj=', envobj);
    envobj.boxflag[ndx] = false;
    envobj.inflow[ndx] = 0;
    envobj.outflow[ndx] = 0;
    envobj.initial[ndx] = 0;
    envobj.geometry[ndx] = "grid";
    envobj.inflowx1[ndx] = 0;                     //techincally should be rand between 0 and cols-1
    envobj.inflowx2[ndx] = envobj.inflowx1[ndx]; 
    envobj.inflowy1[ndx] = 0;                     //techincally should be rand between 0 and rows-1
    envobj.inflowy2[ndx] = envobj.inflowy1[ndx];
    envobj.outflowx1[ndx] = 0;                     //techincally should be rand between 0 and cols-1
    envobj.outflowx2[ndx] = envobj.inflowx1[ndx]; 
    envobj.outflowy1[ndx] = 0;                     //techincally should be rand between 0 and rows-1
    envobj.outflowy2[ndx] = envobj.inflowy1[ndx]; 
    envobj.xdiffuse[ndx] = 1;
    envobj.ydiffuse[ndx] = 1;
    envobj.xgravity[ndx] = 0;
    envobj.ygravity[ndx] = 0;
    envobj.type[ndx] = 'inf';
    envobj.region[ndx] = 'ed';
    envobj.side[ndx] = 'lf';
    
    //process all data pairs
    var len = pairArray.length;
    //console.log('len=',len,'; pairArray=',pairArray);
    for (var ii=1; ii < len; ii++) {
      pear = pairArray[ii].split('=');
      //console.log('Resource: ii=',ii,'; pear', pear);
      nn = av.fzr.env.rsrce_param.indexOf(pear[0].toLowerCase());
      if (-1 < nn) {
        envobj[av.fzr.env.rsrce_param[nn]][ndx] = pear[1];
      }
      else {
        if ('cellbox' == pear[0].toLowerCase()) {
          cellboxdata = pear[1].split('|');
          //console.log('cellboxdata=',cellboxdata);
          envobj.boxflag[ndx] = true;
          envobj.boxx[ndx] = cellboxdata[0];
          envobj.boxy[ndx] = cellboxdata[1];
          envobj.boxcol[ndx] = cellboxdata[2];
          envobj.boxrow[ndx] = cellboxdata[3];
        }
        else {
          lineErrors = 'leftside, '+pear[0]+', not a valid resource keyword. lnArray = '+lnArray;
          //console.log(lineErrors);
        }
      }
    };
    // Assign layout parameters based on the resource name
    // If there is a number, then 0 = entire dish; 1=upper left; 2=upper right; 3=lower left; 4= lower right
    // if there is a letter combination with underbars those split out. 
    //var re_num = '^\d{1,9}$';
    //var matchNum = envobj.name[ndx].match(re_num);
    //console.log('envobj.name[ndx]=', envobj.name[ndx],'; matchNum=', matchNum);
    
    var matchNum = av.fzr.env.regionNum.indexOf( envobj.name[ndx].substring(3).toString() );
    //console.log('av.fzr.env.regionNum=', av.fzr.env.regionNum,'; envobj.name[ndx].substring(3)=',envobj.name[ndx].substring(3),'; matchNum=', matchNum);
    //console.log('matchNum=', matchNum);
    if (-1 < matchNum) {
      //console.log('matchNum=', matchNum, '; av.fzr.env.region[matchNum]' = av.fzr.env.region[matchNum]);
      envobj.region[ndx] = av.fzr.env.region[matchNum];
      if (0 < envobj.initial[ndx]) envobj.type[ndx] = 'fin';
      if (0 < envobj.inflow[ndx]) envobj.type[ndx] = 'equ';      
      envobj.side[ndx] = 'un';
    }
    else {
      codes = envobj.name[ndx].split('_');  //task_region_type_side  with side optional
      //console.log('codes=', codes);
      envobj.region[ndx] = codes[1];
      envobj.type[ndx] = codes[2];
      envobj.side[ndx] = codes[3];
      matchNum = av.fzr.env.region.indexOf(codes[1]);
    };
    //console.log('matchNum=', matchNum, '; region=', envobj.region[ndx]);
      //now assign an index to the region list. 
    envobj.regionList[matchNum] = ndx;

    //console.log('matchNum=', matchNum,'; logtype=', logtype,'ndx=',ndx,'av.fzr.env.rsrce['+logtype+'].regionList=', av.fzr.env.rsrce[logtype].regionList);
  }  
  // valid logic name not found;
  else {lineErrors = 'resource,'+pairArray[0].substring(0,3)+' not found in av.sgr.logicNames';}
  
  //co/nsole.log('lineErrors=', lineErrors);
  return lineErrors;
};

// Uses environment.cfg file to create a structure to hold environment variables. 
av.frd.environmentParse = function (filestr) {
  'use strict';
  var errors='';
  var reacError, rsrcError;
  var eolfound;
  var lineobj;
  var matchComment, matchContinue, matchResult;
  var aline;
  var lines = filestr.split('\n');
  var lngth = lines.length;
  var re_comment = /^(.*?)#.*$/;   //look at begining of the line and look until #; used to get the stuff before the #
  var re_continue = /^(.*?)\\/;  //look for continuation line
  var re_REACTION = /^(.*?)REACTION/i;
  var re_RESOURCE = /RESOURCE/i;
  var lineArray;
  var ii = 0;
  while (ii < lngth) {
    eolfound = false;
    //console.log("lines["+ii+"]=", lines[ii]);
    matchComment = lines[ii].match(re_comment);
    //console.log('matchComment=',matchComment);
    if (null != matchComment) {aline = matchComment[1];}
    else aline = lines[ii];
    if (3 < aline.length) {
      //console.log('aline.length=', aline.length,'; aline=', aline);
      do {
        //console.log('ii', ii, '; eolfound=', eolfound,'; aline=', aline);
        if (ii+1 < lngth) {
          matchContinue = aline.match(re_continue);
          //console.log('matchContinue=',matchContinue);
          if (null != matchContinue) {
            ii++;
            //console.log('ii=', ii);
            matchComment = lines[ii].match(re_comment);
            //console.log('matchComment=',matchComment);
            if (null != matchComment) {aline = matchContinue[1]+matchComment[1];}
            else aline = matchContinue[1]+lines[ii];
          }
          else eolfound = true;
        }
        else eolfound = true;
        //console.log('ii', ii, '; eolfound=', eolfound,'; aline=', aline);
      }
      while (!eolfound)  //end of subloop for continuation lines
      //console.log('ii', ii, '; aline=', aline);
      // look for valid starting keyword
      lineArray = av.utl.spaceSplit(aline).split('~');      //change , to !; remove leading and trailing space and replaces white space with a ~, then splits on ~
      //console.log('lineArray=', lineArray);
      matchResult = lineArray[0].match(re_REACTION);
      //console.log('matchReaction=', matchResult);
      if (null != matchResult) reacError = av.frd.reactionLineParse(lineArray);
      else {reacError='none';}
      
      matchResult = lineArray[0].match(re_RESOURCE);
      //consolen('matchResource=', matchResult);
      if (null != matchResult) rsrcError = av.frd.resourceLineParse(lineArray);
      else {rsrcError = 'none';}
      
      if ('none' != rsrcError || 'none' != reacError) {
        //console.log('errors in line: ii=', ii, '; aline=', aline);
        errors += 'ii='+ii+'; rsrcError='+rsrcError+'; reacError='+reacError+'\n';
      }
    }  //end of processing lines longer than 3 characters
    ii++;
  } // while that goes through lines in file. 
  //console.log('----------------------------------------------------------------------------------------------------');
  console.log('av.fzr.env=', av.fzr.env);
  return errors;
};

// puts data from the environment.cfg into the setup form for the population page
av.frd.environment2struct = function (fileStr) {
  'use strict';
  //console.log('in av.frd.environment2struct');
  var errors = av.frd.environmentParse(fileStr);
  if (1 < errors.length) console.log('errors=', errors);
  av.ptd.showEnv('av.frd.environment2struct');
};

//--------------------------------------------- section to put data from avida.cfg into setup form of population page --
//makes a dictionary entry out of line if the key and value are the first two items.
av.frd.avidaCFGlineParse = function(instr){
  'use strict';
  var cfgary = av.utl.flexsplit(instr).split(',');  //replaces white space with a comma, then splits on comma
  var rslt = {
    name : cfgary[0],
    value : cfgary[1]
  };
  return rslt;
};

// makes a dictionary out of a avida.cfg file
av.frd.avidaCFGparse = function (filestr) {
  'use strict';
  var rslt = {};
  var lines = filestr.split('\n');
  var lngth = lines.length;
  for (var ii = 0; ii < lngth; ii++) {
    var lineobj = av.frd.avidaCFGlineParse(lines[ii]);
    rslt[lineobj.name.toUpperCase()] = lineobj.value;
  } // for
  return rslt;
};

// puts data from the avida.cfg into the setup form for the population page
av.frd.avidaCFG2form = function (fileStr){
  'use strict';
  var dict = av.frd.avidaCFGparse(fileStr);
  //console.log('av.frd.avidaCFG2form; dict=', dict);
  av.dom.sizeCols.value = dict.WORLD_X;
  av.grd.gridWasCols = Number(dict.WORLD_X);  
  av.grd.setupCols = Number(dict.WORLD_X);  
  av.fzr.env.fileCols = Number(dict.WORLD_X);
  //dijit.byId('sizeCols').set('value', dict.WORLD_X);
  av.dom.sizeRows.value = dict.WORLD_Y;
  //dijit.byId('sizeRows').set('value', dict.WORLD_Y);
  av.grd.gridWasRows = Number(dict.WORLD_Y);
  av.grd.setupRows = Number(dict.WORLD_Y);
  av.fzr.env.fileRows = Number(dict.WORLD_Y);
  document.getElementById('muteInput').value = dict.COPY_MUT_PROB*100;
  //var event = new Event('change');
  var event = new window.CustomEvent('change');
  document.getElementById('muteInput').dispatchEvent(event);
  if (0==dict.BIRTH_METHOD) {
    dijit.byId('childParentRadio').set('checked', true);
    dijit.byId('childRandomRadio').set('checked', false);
  }
  else {
    dijit.byId('childParentRadio').set('checked', false);
    dijit.byId('childRandomRadio').set('checked', true);
  }

  if (-1 == dict.RANDOM_SEED) {
    dijit.byId('experimentRadio').set('checked', true);
    dijit.byId('demoRadio').set('checked', false);
  }
  else {
    dijit.byId('experimentRadio').set('checked', false);
    dijit.byId('demoRadio').set('checked', true);
  };
};
//---------------------------------------------------------------------------------------------- av.frd.avidaTestform --
av.frd.avidaTestform = function (fileStr){
  'use strict';
  //console.log('in av.frd.avidaTestform');
  var dict = av.frd.avidaCFGparse(fileStr);
  document.getElementById('sizeColTest').value = dict.WORLD_X;
  //av.grd.gridWasCols = dict.WORLD_X;
  av.grd.gridWasCols = Number(dict.WORLD_X);  
  av.grd.setupCols = Number(dict.WORLD_X); 
  av.fzr.env.fileCols = Number(dict.WORLD_X);
  
  document.getElementById('sizeRowTest').value = dict.WORLD_Y;
  //av.grd.gridWasRows = dict.WORLD_Y;
   av.grd.gridWasRows = Number(dict.WORLD_Y);
  av.grd.setupRows = Number(dict.WORLD_Y);
  av.fzr.env.fileRows = Number(dict.WORLD_Y);
 
  document.getElementById('muteInpuTest').value = dict.COPY_MUT_PROB*100;
 
  //var event = new Event('change');
  var event = new window.CustomEvent('change');
  document.getElementById('muteInpuTest').dispatchEvent(event);
  if (0==dict.BIRTH_METHOD) {
    dijit.byId('childParentRadiTest').set('checked', true);
    dijit.byId('childRandomRadiTest').set('checked', false);
  }
  else {
    dijit.byId('childParentRadiTest').set('checked', false);
    dijit.byId('childRandomRadiTest').set('checked', true);
  }
  av.dom.manualUpdateRadiTest.value = dict.RANDOM_SEED;
/*
  if (-1 == dict.RANDOM_SEED) {
    dijit.byId('experimentRadiTest').set('checked', true);
    dijit.byId('demoRadiTest').set('checked', false);
  }
  else {
    dijit.byId('experimentRadiTest').set('checked', false);
    dijit.byId('demoRadiTest').set('checked', true);
  }
  */
};
//------------------------------------------------------------------------------------------ end processing avida.cfg --

//--------------------- puts data from the av.frd.pauseRun.txt file into the setup form for the population page---------
av.frd.pauseRunAtTest2form = function (fileStr) {
  'use strict';
  var update = parseInt(fileStr);
  if (0 < update) {
    dijit.byId('manualUpdateRadiTest').set('checked', false);
    dijit.byId('autoUpdateRadiTest').set('checked', true);
    dijit.byId('autoUpdateSpinneTest').set('value', update);
  }
  else {
    dijit.byId('manualUpdateRadiTest').set('checked', true);
    dijit.byId('autoUpdateRadiTest').set('checked', false);
    dijit.byId('autoUpdateSpinneTest').set('value', '1000');
  }
};

//--------------------- puts data from the av.frd.pauseRun.txt file into the setup form for the population page---------
av.frd.pauseRunAtTXT2form = function (fileStr) {
  'use strict';
  var update = parseInt(fileStr);
  if (0 < update) {
    dijit.byId('manualUpdateRadio').set('checked', false);
    dijit.byId('autoUpdateRadio').set('checked', true);
    dijit.byId('autoUpdateSpinner').set('value', update);
  }
  else {
    dijit.byId('manualUpdateRadio').set('checked', true);
    dijit.byId('autoUpdateRadio').set('checked', false);
    dijit.byId('autoUpdateSpinner').set('value', '1000');
  }
};

//----------------------- section to put data from ancestors file into ancestorBox and placeparents auto ---------------

// makes a list out of a ancestor file
av.fio.autoAncestorParse = function (filestr) {
  'use strict';
  var rslt = {};
  rslt.nam = [];
  rslt.gen = [];
  var lineobj, gen, name;
  var lines = filestr.split('\n');
  var kk = 0;
  var lngth = lines.length;
  for (var ii = 0; ii < lngth; ii++) {
    if (1 < lines[ii].length) {
      if (ii % 2 < 1) {//even
        rslt.nam[kk] = lines[ii];  //tiba need to get rid of whitespace in string
      }
      else { //odd
        rslt.gen[kk] = lines[ii]; //content will be genome line; leave white space alone
        //console.log('autAncestor', kk, rslt.nam[kk], rslt.gen[kk]);
        kk++;
      }
    }
  } // for
  return rslt;
};

// puts data from the ancestor into parents file using autoplace
av.fio.autoAncestorLoad = function(fileStr) {
  'use strict';
  if (av.debug.fio) console.log('in av.autoAncestorLoad: fileStr', fileStr);
  var rslt = av.fio.autoAncestorParse(fileStr);
  //Now put in ancestors and place parents
  var lngth = rslt.nam.length;
  for (var ii = 0; ii < lngth; ii++) {
    av.parents.genome.push(rslt.gen[ii]);
    var nn = av.parents.name.length;
    av.parents.name.push(rslt.nam[ii]);
    av.parents.howPlaced.push('auto');
    var domIds;
    if ('test' == av.msg.setupType) {
      av.dnd.ancestorBoTest.insertNodes(false, [{data: rslt.nam[ii], type: ['g']}]);
      av.dnd.ancestorBoTest.sync();
      domIds = Object.keys(av.dnd.ancestorBoTest.map);
    }
    else {
      av.dnd.ancestorBox.insertNodes(false, [{data: rslt.nam[ii], type: ['g']}]);
      av.dnd.ancestorBox.sync();
      domIds = Object.keys(av.dnd.ancestorBox.map);
    }
    if (av.debug.fio) console.log('autoPlaceParent: domIds', domIds, '; length', domIds.length);
    av.parents.domid.push(domIds[domIds.length-1]); //domid in ancestorBox used to remove if square in grid moved to trashcan
    //Find color of ancestor
    if (0 < av.parents.Colors.length) { av.parents.color.push(av.parents.Colors.pop());}
    else { av.parents.color.push(av.color.defaultParentColor); }
    av.parents.autoNdx.push(nn);
    av.parents.placeAncestors();
    if (av.debug.fio) console.log('av.parents:  name', av.parents.name[nn], av.parents.domid[nn], av.parents.genome[nn]);
  }
};

//---------------- section to put data from ancestors_manual.txt' file into ancestorBox and placeparents hand ---------------

// makes a listing out of a ancestors_manual.txt' file
av.fio.handAncestorParse = function (filestr) {
  'use strict';
  console.log('filestr=', filestr);
  var rslt = {};
  rslt.nam = [];
  rslt.gen = [];
  rslt.col = [];
  rslt.row = [];
  var lineobj, gen, xx, yy;
  var pair = [];
  var lines = filestr.split('\n');
  var lngth = lines.length;
  var kk = 0;
  for (var ii = 0; ii < lngth; ii++) {
    if (1 < lines[ii].length) {
      if (0 === ii % 3) {// divide by 3 evenly => first line
        rslt.nam[kk] = lines[ii];  //tiba need to get rid of whitespace in string
      }
      else if (1 === ii % 3){ //second line
        rslt.gen[kk] = lines[ii]; //content will be genome line; leave white space alone
      }
      else {  //third line
        pair = lines[ii].split(',');
        rslt.col[kk] = Number(pair[0]);
        rslt.row[kk] = Number(pair[1]);
        kk++;
      }
    }
  } // for
  return rslt;
};

// puts data from the ancestor into parents file by hand
av.fio.handAncestorLoad = function(fileStr) {
  'use strict';
  console.log('in av.fio.handAncestorLoad');
  if (av.debug.fio || true) console.log('in av.fio.handAncestorLoad: fileStr', fileStr);
  var stuff = av.fio.handAncestorParse(fileStr);
  if (av.debug.fio) console.log('in av.fio.handAncestorLoad: stuff', stuff);
  //Now put in ancestors and place parents
  var lngth = stuff.nam.length;
  for (var kk = 0; kk < lngth; kk++) {
    var nn = av.parents.name.length;
    av.parents.name.push(stuff.nam[kk]);
    var domIds;
    if ('test' == av.msg.setupType) {
      av.dnd.ancestorBoTest.insertNodes(false, [{data: stuff.nam[kk], type: ['g']}]);
      av.dnd.ancestorBoTest.sync();
      domIds = Object.keys(av.dnd.ancestorBoTest.map);
    }
    else {
      av.dnd.ancestorBox.insertNodes(false, [{data: stuff.nam[kk], type: ['g']}]);
      av.dnd.ancestorBox.sync();
      domIds = Object.keys(av.dnd.ancestorBox.map);
    }
    if (av.debug.fio) console.log('handAncestorLoad: domIds', domIds, '; length', domIds.length);
    av.parents.domid.push(domIds[domIds.length-1]); //domid in ancestorBox used to remove if square in grid moved to trashcan
    //Find color of ancestor
    if (0 < av.parents.Colors.length) { av.parents.color.push(av.parents.Colors.pop());}
    else { av.parents.color.push(av.color.defaultParentColor); }
    av.parents.handNdx.push(nn);
    av.parents.howPlaced.push('hand');
    av.parents.genome[nn] = stuff.gen[kk];
    av.parents.col[nn] = stuff.col[kk];
    av.parents.row[nn] = stuff.row[kk];
    av.parents.injected[nn] = false;
    av.parents.AvidaNdx[nn] = av.parents.col[nn] + Number(av.parents.row[nn]) * Number(av.dom.sizeCols.value);
    //av.parents.AvidaNdx[nn] = av.parents.col[nn] + Number(av.parents.row[nn]) * Number(dijit.byId('sizeCols').get('value'));
    //av.parents.AvidaNdx[av.parents.autoNdx[ii]] = av.parents.col[av.parents.autoNdx[ii]] + cols * av.parents.row[av.parents.autoNdx[ii]];
    if (av.debug.fio) console.log('av.parents:  name', av.parents.name[nn], '; domid', av.parents.domid[nn], '; gen', av.parents.genome[nn]);
  }
  if (av.debug.fio) console.log('parents', av.parents);
};

//----------------------- section to put data from clade.ssg into parents ----------------------------------------------

// makes a dictionary out of a clade.ssg file
av.frd.cladeSSGparse = function (filestr) {
  'use strict';
  var rslt = [];
  var lineobj, cfgary, name;
  var lines = filestr.split('\n');
  var lngth = lines.length;
  for (var ii = 0; ii < lngth; ii++) {
    if (1 < lines[ii].length) {
      cfgary = av.utl.flexsplit(lines[ii]).split(',');   //replaces white space with a comma, then splits on comma
      name = cfgary[0];
      if ('#' != name[0]) {
        rslt.push(name);
      }
    }
  } // for
  return rslt;
};

// puts data from the clade.ssg into the parents structure
av.fio.cladeSSG2parents = function (fileStr) {
  'use strict';
  var list = av.frd.cladeSSGparse(fileStr);
  var lngth = list.length;
  for (var ii = lngth-1; 0 <= ii; ii--) {
    av.parents.name[ii] = list[ii];
    av.parents.injected[ii] = false;
    //console.log('Dads', list[ii]);
    av.dnd.ancestorBox.insertNodes(false, [{data: av.parents.name[ii], type: ['g']}]);
    // need to find the domid of the ancestor in ancestorBox. The line below is not correct. ???? !!!!! tiba
    var domIDs = Object.keys(av.dnd.ancestorBox.map);
    av.parents.domid.push(domIDs[domIDs.length-1]);
    //Find color of ancestor
    if (0 < av.parents.Colors.length) {av.parents.color.push(av.parents.Colors.pop());}
    else {av.parents.color.push(av.color.defaultParentColor);}
  }
  av.dnd.ancestorBox.sync();
  //console.log('parents', av.parents);
};

//----------------------- section to put data from timeRecorder.csv file into data from charts ----------------------

// makes arrays out of a time recorder file
av.frd.timeRecorder2chart = function (filestr) {
  'use strict';
  if (undefined !== filestr) {
    var jj = 0;
    var lineData, aline, headerLine, functionLine;
    var lines = filestr.split('\n');
    var lngth = lines.length;
    //console.log('length= ', lngth, '; lines = ', lines);

    //Used to find the maxium for each data column
    av.pch.aveMaxFit = 0;
    av.pch.aveMaxCst = 0;
    av.pch.aveMaxEar = 0;
    av.pch.aveMaxNum = 0;
    av.pch.aveMaxVia = 0;
    av.pch.logMaxFit = 0;
    av.pch.logMaxCst = 0;
    av.pch.logMaxEar = 0;
    av.pch.logMaxNum = 0;

    av.pch.fnBinary = '000000000';            //default is all buttons off.
    for (var ii = 0; ii < lngth; ii++) {
      if (1 < lines[ii].length) {
        aline = lines[ii];
        //console.log('aline[0]', aline[0]);
        if ('#' == aline[0]) {
          //console.log('aline.substring.(0,11) = ', aline.substring(0,11));
          if ('# Functions' == aline.substring(0,11)) {
            //console.log('functionLine = ', aline);
            av.pch.fnBinary = aline.substring(14, 24);
            console.log('av.pch.fnBinary = ', av.pch.fnBinary, '; aline=', aline);
          }
        }
        else {
          //console.log('lines[ii]',lines[ii]);
          lineData = lines[ii].split(',');
          if ('Update' == lineData[0]) {
            headerLine = lineData;
            //console.log('headerLine',headerLine);
          }
          else {
            //console.log('lineData',lineData);
            //console.log('av.pch.nUpdate', av.pch.nUpdate);
            //console.log('jj=', jj);
            av.pch.nUpdate[jj] = Number(lineData[0]);
            //console.log('av.pch.nUpdate[jj]',av.pch.nUpdate[jj]);
            av.pch.aveFit[jj] = Number(lineData[1]);
            av.pch.aveCst[jj] = Number(lineData[2]);
            av.pch.aveEar[jj] = Number(lineData[3]);
            av.pch.aveNum[jj] = Number(lineData[4]);
            av.pch.aveVia[jj] = Number(lineData[5]);
            av.pch.logFit[jj] = Number(lineData[6]);
            av.pch.logCst[jj] = Number(lineData[7]);
            av.pch.logEar[jj] = Number(lineData[8]);
            av.pch.logNum[jj] = Number(lineData[9]);
            av.pch.xx[jj] = jj;
            if (av.pch.aveFit[jj] > av.pch.aveMaxFit) av.pch.aveMaxFit = av.pch.aveFit[jj];
            if (av.pch.aveCst[jj] > av.pch.aveMaxCst) av.pch.aveMaxCst = av.pch.aveCst[jj];
            if (av.pch.aveEar[jj] > av.pch.aveMaxEar) av.pch.aveMaxEar = av.pch.aveEar[jj];
            if (av.pch.aveNum[jj] > av.pch.aveMaxNum) av.pch.aveMaxNum = av.pch.aveNum[jj];
            if (av.pch.aveVia[jj] > av.pch.aveMaxVia) av.pch.aveMaxVia = av.pch.aveVia[jj];
            if (av.pch.logFit[jj] > av.pch.logMaxFit) av.pch.logMaxFit = av.pch.logFit[jj];
            if (av.pch.logCst[jj] > av.pch.logMaxCst) av.pch.logMaxCst = av.pch.logCst[jj];
            if (av.pch.logEar[jj] > av.pch.logMaxEar) av.pch.logMaxEar = av.pch.logEar[jj];
            if (av.pch.logNum[jj] > av.pch.logMaxNum) av.pch.logMaxNum = av.pch.logNum[jj];
            jj++;
          }
        }
      }
    } // for
    //console.log('headerLine = ', headerLine, '; jj=', jj);
    //console.log('av.pch = ', av.pch);
    return;
  }
};

//Load Time Recorder Data.
av.frd.loadTimeRecorderData = function(dir) {
  'use strict';
//console.log('fzr.file', av.fzr.file);
// if there is NOT a timeRecorder.csv file, then look for tr0, tr1, tr2, tr3 and tr4
  if (undefined == av.fzr.file[dir + '/timeRecorder.csv']) {
    av.pch.aveFit = av.fio.tr2chart(av.fzr.file[dir + '/tr0']);
    av.pch.aveCst = av.fio.tr2chart(av.fzr.file[dir + '/tr1']);
    av.pch.aveEar = av.fio.tr2chart(av.fzr.file[dir + '/tr2']);
    av.pch.aveNum = av.fio.tr2chart(av.fzr.file[dir + '/tr3']);
    av.pch.aveVia = av.fio.tr2chart(av.fzr.file[dir + '/tr4']);
    console.log('via=', av.fzr.file[dir + '/tr4']);
    //av.pch.xx = [];  in globals.js
    //console.log('av.pch.aveFit', av.pch.aveFit);
    lngth = av.pch.aveFit.length;
    av.pch.logFit = av.utl.newFilledArray(lngth, null);
    av.pch.logCst = av.utl.newFilledArray(lngth, null);
    av.pch.logEar = av.utl.newFilledArray(lngth, null);
    av.pch.logNum = av.utl.newFilledArray(lngth, null);
    for (var ii = 0; ii < lngth; ii++) av.pch.xx[ii] = ii;
  }
  else {
    //console.log('av.fzr.file.' + dir + '/timeRecorder.csv=', av.fzr.file[dir + '/timeRecorder.csv']);
    //console.log('av.fzr.file.' + dir + '/timeRecorder.csv.length=', av.fzr.file[dir + '/timeRecorder.csv'].length);

    av.frd.timeRecorder2chart(av.fzr.file[dir+'/timeRecorder.csv']);
    console.log('av.pch.fnBinary = ', av.pch.fnBinary);
  }
};

//----------------------- section to put data from time recorder (tr) files into data from charts ----------------------

// makes a dictionary out of a time recorder file
av.frd.tr2chartParse = function (filestr) {
  'use strict';
  var rslt = {};
  rslt.update = [];
  rslt.data = [];
  var lineobj, cfgary, name;
  var pairs = filestr.split(',');
  var pairLngth = pairs.length;
  if (av.debug.fio) console.log('pairLngth', pairLngth);
  for (var ii = 0; ii < pairLngth; ii++) {
    lineobj = pairs[ii].split(':');
    rslt.update[ii] = Number(lineobj[0]);
    rslt.data[ii] = Number(lineobj[1]);
  } // for
  return rslt.data;
};

// puts data from the time recorder data into the right format
av.fio.tr2chart = function (fileStr) {
  'use strict';
  var data = [];
  if (undefined !== fileStr) { data = av.frd.tr2chartParse(fileStr); }
  return data;
};

//nothing in this section works.
//------------------------------------------------- rest may not be in use ---------------------------------------------
// http://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
/*
function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('av.mouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
}
*/

/*
//console.log('declaring window.downloadFile()');
// http://pixelscommander.com/en/javascript/javascript-file-download-ignore-content-type/
window.downloadFile = function(sUrl) {

  //If in Chrome or Safari - download via virtual link click
  if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;

    if (link.download !== undefined){
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('av.mouseEvents');
      e.initEvent('click' ,true ,true);
      link.dispatchEvent(e);
      return true;
    }
  }

  // Force file download (whether supported by server).
  var query = '?download';

  window.open(sUrl + query);
}

//------------------------------------------- not using ----------------------------------------------------------------
/*
function writeDxFile(db, path, contents) {
  'use strict';
  db.work.add( {
      name: path,
      timestamp: Date.now(),  //We may need to do more work with this property
      contents: contents,
      mode: 33206
    }
  ).then(function () {
      //console.log('Able to add file ' + path);
    }).catch(function () {
      console.log('Unable to add file ' + path);
    });
}
*/

