import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { TreeNode } from '../nodeTree/TreeNode';
import { UserrolesComponent } from '../components/userroles/userroles.component'

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(){}//private http: Http) { }

  getFiles() {
    //alert(this.userRole.varList);
    // return this.http.get('/assets/mock/data/files.json')
    //   .toPromise()
    //   .then(res => <TreeNode[]>res.json().data);
  }
}
