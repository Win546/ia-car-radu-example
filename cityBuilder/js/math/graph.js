class Graph{
    constructor(points = [], segments =[]){
       this.points = points;
       this.segments = segments;
    };
    
    
  static load(info){
      
   const pointsMap = new Map();
    const segments = [];

    // Create points and store them in a map for quick access
    for (const pointInfo of info.points) {
        const pointKey = `${pointInfo.x},${pointInfo.y}`;
        if (!pointsMap.has(pointKey)) {
            const point = new Point(pointInfo.x, pointInfo.y);
            pointsMap.set(pointKey, point);
        }
    }

    // Create segments using points from the map
    for (const segInfo of info.segments) {
        const p1Key = `${segInfo.p1.x},${segInfo.p1.y}`;
        const p2Key = `${segInfo.p2.x},${segInfo.p2.y}`;
        const p1 = pointsMap.get(p1Key);
        const p2 = pointsMap.get(p2Key);
        if (p1 && p2) {
            const segment = new Segment(p1, p2);
            segments.push(segment);
        }
    }

    return new Graph(Array.from(pointsMap.values()), segments);
    }       
    
    hash(){
        return JSON.stringify(this)
    }
    
    addPoint(point){
        this.points.push(point)
    }
    
    containsPoint(point){
        return this.points.find((p)=>p.equals(point))
    }
    containsSegment(seg){
        return this.segments.find((s)=>s.equals(seg))
    }
    
    
    
     tryAddPoint(point){
         if(!this.containsPoint(point)){
             this.addPoint(point)
             return true;
         }
          return false;
    }
    
     tryAddSegment(seg){
         if(!this.containsSegment(seg) && !seg.p1.equals(seg.p2)){
             this.addSegment(seg)
             return true;
         }
          return false;
    }
    
    
    removeSegment(seg){
        this.segments.splice(this.segments.indexOf(seg),1)
        
    }
    
    getSegmentsWithPoint(point){
        const segs = [];
        for (const seg of this.segments){
            if (seg.includes(point)){
                segs.push(seg)
            }
        }
        return segs;
    }
    
    dispose(){
            this.points.length= 0;
            this.segments.length= 0;
    }
    
    removePoint(point){
        const segs = this.getSegmentsWithPoint(point)
        for( const seg of segs){
            
       this.removeSegment(seg);
    }
         this.points.splice(this.points.indexOf(point),1)
    }
    addSegment(seg){
        this.segments.push(seg)
    }
    draw(ctx){
        for (const seg of  this.segments){
            seg.draw(ctx);
        }
        
         for (const point of  this.points){
            point.draw(ctx);
        }
    }
    
};