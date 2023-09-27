import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoorService } from 'src/app/service/door.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-import-doors-popup',
  templateUrl: './import-doors-popup.component.html',
  styleUrls: ['./import-doors-popup.component.scss']
})
export class ImportDoorsPopupComponent implements OnInit {

  loadingState = true;
  doorImportList: Array<any> = [];
  pagination: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentUser: any;
  lastpage: any;
  editId = null;
  showLoader = false;
  isEditing = false;
  dataArray = [];
  doorLocations = [
    {
      id: "IN",
      name: "Inside Compound",
    },
    {
      id: "OUT",
      name: "Compound Exit"
    }
  ];
  // selectedDoor:any = 'IN';
  selectedDoor: any = [];
  releaseDoorOption: any = ['YES', 'NO'];
  selectedReleaseDoor: any = [];
  selectedRemarks: any= [];
  // selectedReleaseDoor = 'NO';
  testPopUp = 'tabletest'
  testPopUp2 = 'server'
  sNo=[];
  startCounting=1

  constructor(
    private doorService: DoorService,
    private router: Router,
    private paginationService: PaginationService,
    public dialogRef: MatDialogRef<ImportDoorsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportDoorsPopupComponent,
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    if(this.data){
      this.testPopUp = this.data?.testPopUp
      this.testPopUp2 = this.data?.testPopUp2
      this.getImortDoors(this.data);
    }
    this.dataArray = []
    this.getSNo(this.currentPage)
  }

  getImortDoors(data:any) {
    data.importDoordata
    this.loadingState = true;
    const params: any = {
      pagenumber: this.currentPage,
      pagesize: this.currentPageLimit
    };
    this.doorService.getReadersList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response) {
          this.doorImportList = response.data.item_list;
          this.lastpage = response?.data?.total_pages;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['total_items'],
            this.currentPage,
            this.currentPageLimit
          );
          let doorList=[];
          data?.importDoordata?.forEach((e,i)=>{
            doorList.push(e?.doorName)
          })
          this.doorImportList?.forEach((door,i)=>{
            this.selectedDoor.push('IN');
            this.selectedReleaseDoor.push('NO')
            this.doorImportList[i].isSelected =doorList?.includes(door?.property_value_map.name)
            this.doorImportList[i].selectedId = data?.importDoordata?.filter(e => e?.doorName == door?.property_value_map.name)[0]?.id;
          })
        }
      },
      (error) => {
        this.loadingState = false;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.startCounting = (this.currentPageLimit*this.currentPage)-(this.currentPageLimit-1)
    this.getSNo(this.currentPage)
    this.getImortDoors(this.data);
  }

  getSNo(currentPage){
    this.sNo=[]
    for(let i=this.startCounting;i<=this.currentPageLimit*currentPage;i++){
         this.sNo.push({
          sNo:i
     })
    }
  }
  onSelect(selectedItem: any, i) {
    this.doorImportList[i].isSelected = !this.doorImportList[i].isSelected
    if(selectedItem?.isSelected){
   
      let index = this.dataArray.findIndex((c) => c.readerID == selectedItem.property_value_map?.readerID);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }
      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        doorName : selectedItem?.property_value_map.name,
        doorDirection: this.selectedDoor[i],
        allowsreleasefromVMSStation: (this.selectedReleaseDoor[i] === 'YES') ? true : false,
        remarks:this.selectedRemarks[i],
        readerID: selectedItem?.property_value_map.readerID,
        panelID: selectedItem?.property_value_map.panelID,
        isActive :true ,
      })
    }else{
      let index = this.dataArray.findIndex((c) => c.readerID == selectedItem.property_value_map?.readerID);
      if (index !== -1) {
        this.dataArray.splice(index, 1);
      }

      this.dataArray.push({
        id:selectedItem?.selectedId == undefined ? 0 : selectedItem?.selectedId,
        doorName : selectedItem?.property_value_map.name,
        doorDirection: this.selectedDoor[i],
        allowsreleasefromVMSStation:  (this.selectedReleaseDoor[i] === 'YES') ? true : false,
        remarks:this.selectedRemarks[i],
        readerID: selectedItem?.property_value_map.readerID,
        panelID: selectedItem?.property_value_map.panelID,
        isActive : false,
      })
    }
  }

  onSelection(type, data, i)  {
    
    if(type === 'door') {
      // this.selectedDoor = data
      this.selectedDoor[i] = data.value;
    } else {
      // this.selectedReleaseDoor = data
      this.selectedReleaseDoor[i] = data.value
    }
  }

  saveDoor(){
    this.doorService.saveDoor(this.dataArray).subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
          this.close();
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/acs-settings/doors-list']);
          });
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
}

  close(){
    this.dialogRef.close();
  }

}
