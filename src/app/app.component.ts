import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  socket: SocketIOClient.Socket;
  pollObj={question:"",options:[]};

  vote:number;
  error:String="";

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.socket = io.connect();
  }
  ngOnInit() {
    console.log("Be called");
    this.listen2NewConnet();
    this.listen2NewVote();
    
  }
  //listen the new connetion 
  listen2NewConnet(){
    this.socket.on("newClinet",data=>{
      this.setLabel(data);
      this.setDate(data);
      this.pollObj =data;
    })
    
  }
  sendVote(){
      this.socket.emit("newVote",{vote:this.vote})
  }
  listen2NewVote(){
    this.socket.on("vote",data=>{
      this.setLabel(data);
      this.setDate(data);
      this.pollObj=data;
      console.log(this.pieChartData);
      console.log(this.pieChartLabels);
    })

  }
  setLabel(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].text)
    }
    this.pieChartLabels =  arr;
  }
  setDate(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].count); 
    }
    this.pieChartData = arr;
  }

}
