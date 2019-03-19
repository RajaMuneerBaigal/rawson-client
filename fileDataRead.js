//Read file data
var av = av || {};  //incase av already exists
var dijit = dijit || {};  //incase av already exists


av.fio.addFzItem = function(dndSection, name, type, fileNum) {
  'use strict';
  if (undefined != dndSection) {
    dndSection.insertNodes(false, [{data: name, type: [type]}]);
    dndSection.sync();
    var mapItems = Object.keys(dndSection.map);
    var domid = mapItems[mapItems.length - 1];

    //create a right av.mouse-click context menu for the item just created.
    if (av.debug.fio) console.log('fileNum=', fileNum, '; name=', name, '; Section=', dndSection.node.id);
    //console.log('fileNum', fileNum, '; name', name, '; Section', dndSection.node.id, '; type', type);

    if (0 < fileNum) {
      av.dnd.contextMenu(dndSection, domid);
    }
    //av.dnd.contextMenu(dndSection, domid);
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
        if (loadConfigFlag) {
          if ('c0/avida.cfg' == av.fio.anID) {
            av.frd.avidaCFG2form(av.fio.thisfile.asText());
          }
          if ('c0/environment.cfg' == av.fio.anID) {
            av.frd.environmentCFG2form(av.fio.thisfile.asText().trim());
          }
        }
        if ('ancestors' == fileType ||'ancestors_manual' == fileType) {
          av.fio.anID = av.fio.anID + '.txt';
        }
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
  var dir = av.fzr.actConfig.dir;
  var path = dir + '/avida.cfg';
  var doctext = av.fzr.file[path];
  console.log(from, 'called av.frd.updateSetup; dir=', av.fzr.actConfig.dir);
  //console.log('actConfig: path=', path);
  av.frd.avidaCFG2form(doctext);
  doctext = av.fzr.file[dir + '/environment.cfg'];
  av.frd.environmentCFG2form(doctext);
  doctext = av.fzr.file[dir + '/pauseRunAt.txt'];
  av.frd.pauseRunAtTXT2form(doctext);
};
//----------------------------------------------------------------------------------------- end of av.frd.updateSetup --

//------------------------------------------- update config data from file data stored in freezer for test setup page --
av.frd.updateTestSetup = function (from) {
  'use strict';
  var dir = av.fzr.actConfig.dir;
  console.log(from, ' called ', av.frd.updateTestSetup, '; dir=', dir);
  var path = dir + '/avida.cfg';
  var doctext = av.fzr.file[path];
  av.frd.avidaTestform(doctext);
  //av.frd.environment2struct();      //will be called when we get a structure
  //av.frd.environmentTestform(doctext);     //for now editing the whole file
  console.log('av.dom.environConfigEdit=',av.dom.environConfigEdit);
  if (av.fzr.file[av.dnd.move.dir+'/'+ 'environment.cfg'] ) {
    av.dom.environConfigEdit.value = av.fzr.file[av.dnd.move.dir+'/'+'environment.cfg'];
  };
  doctext = av.fzr.file[dir + '/environment.cfg'];
  
  //not sure about this one; may need a test version of this one too
  doctext = av.fzr.file[dir + '/pauseRunAt.txt'];
  av.frd.pauseRunAtTest2form(doctext);
};
//------------------------------------------------------------------------------------- end of av.frd.updateTestSetup --

//--------------------------- section to put data from environment.cfg into setup traditional form of population page --
av.frd.environmentCFGlineParse = function(instr){
  'use strict';
  var num = 0;
  var flag = true;
  //console.log('instr', instr);
  var cfgary = av.utl.flexsplit(instr).split(',');      //replaces white space with a comma, then splits on comma
  if (0 < cfgary[3].length) {num = wsb(':',wsa('=',cfgary[3]));}
  if (0 == num) {flag = false;} //use == in this case as they are of different type
  //if (av.debug.fio) console.log('flag', flag, '; num', num, '; cfgary', cfgary[3], '; instr', instr);
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
  console.log('av.frd.environmentCFG2form; dict=',dict);
  dijit.byId('notose').set('checked', dict.NOT);
  dijit.byId('nanose').set('checked', dict.NAND);
  dijit.byId('andose').set('checked', dict.AND);
  dijit.byId('ornose').set('checked', dict.ORN);
  dijit.byId('orose').set('checked', dict.OR);
  dijit.byId('andnose').set('checked', dict.ANDN);
  dijit.byId('norose').set('checked', dict.NOR);
  dijit.byId('xorose').set('checked', dict.XOR);
  dijit.byId('equose').set('checked', dict.EQU);
};
//--------------------- end ofsection to put data from environment.cfg into setup traditional form of population page --

//----------------------------------------------- section to put data from environment.cfg into environment Structure --

av.frd.environmentLineParse = function(instr){
  'use strict';
  var num = 0;
  var flag = true;
  console.log('instr', instr);
  var cfgary = av.utl.flexsplit(instr).split(',');      //replaces white space with a comma, then splits on comma
  if (0 < cfgary[3].length) {num = wsb(':',wsa('=',cfgary[3]));}
  if (0 == num) {flag = false;} //use == in this case as they are of different type
  //if (av.debug.fio) console.log('flag', flag, '; num', num, '; cfgary', cfgary[3], '; instr', instr);
  var rslt = {
    name : cfgary[1],
    value : flag
  };
  return rslt;
};

// makes a dictionary out of a environment.cfg file
av.frd.environmentParse = function (filestr) {
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
av.frd.environment2struct = function (fileStr) {
  'use strict';
  var dict = av.frd.environmentCFGparse(fileStr);
  console.log('in av.frd.environment2struct; dict=',dict);
  dijit.byId('notose').set('checked', dict.NOT);
  dijit.byId('nanose').set('checked', dict.NAND);
  dijit.byId('andose').set('checked', dict.AND);
  dijit.byId('ornose').set('checked', dict.ORN);
  dijit.byId('orose').set('checked', dict.OR);
  dijit.byId('andnose').set('checked', dict.ANDN);
  dijit.byId('norose').set('checked', dict.NOR);
  dijit.byId('xorose').set('checked', dict.XOR);
  dijit.byId('equose').set('checked', dict.EQU);
/*
 * //for when NOT using digits. plain check boxes
  av.dom.notose.checked = dict.NOT;
  av.dom.andose.checked = dict.AND;
  av.dom.orose.checked = dict.OR;
  av.dom.norose.checked = dict.NOR;
  av.dom.equose.checked = dict.EQU;
  av.dom.nanose.checked = dict.NAND;
  av.dom.ornose.checked = dict.ORN;
  av.dom.andnose.checked = dict.ANDN;
  av.dom.xorose.checked = dict.XOR;
*/
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
  console.log('av.frd.avidaCFG2form; dict=', dict);
  av.dom.sizeCols.value = dict.WORLD_X;
  av.grd.gridWasCols = Number(dict.WORLD_X);  
  av.grd.setupCols = Number(dict.WORLD_X);  
  //dijit.byId('sizeCols').set('value', dict.WORLD_X);
  av.dom.sizeRows.value = dict.WORLD_Y;
  //dijit.byId('sizeRows').set('value', dict.WORLD_Y);
  av.grd.gridWasRows = Number(dict.WORLD_Y);
  av.grd.setupRows = Number(dict.WORLD_Y);
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
  var dict = av.frd.avidaCFGparse(fileStr);
  console.log('av.frd.avidaTestform; dict=', dict);
  document.getElementById('sizeColTest').value = dict.WORLD_X;
  av.grd.gridWasCols = dict.WORLD_X;
  av.grd.gridWasCols = Number(dict.WORLD_X);  
  av.grd.setupCols = Number(dict.WORLD_X);  
  document.getElementById('sizeRowTest').value = dict.WORLD_Y;
  av.grd.gridWasRows = dict.WORLD_Y;
   av.grd.gridWasRows = Number(dict.WORLD_Y);
  av.grd.setupRows = Number(dict.WORLD_Y);
 
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

  if (-1 == dict.RANDOM_SEED) {
    dijit.byId('experimentRadiTest').set('checked', true);
    dijit.byId('demoRadiTest').set('checked', false);
  }
  else {
    dijit.byId('experimentRadiTest').set('checked', false);
    dijit.byId('demoRadiTest').set('checked', true);
  }
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

// makes a dictionary out of a environment.cfg file
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

// puts data from the environment.cfg into the setup form for the Analysis Page
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

