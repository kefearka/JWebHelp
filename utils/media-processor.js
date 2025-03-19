export class MediaProcessor {
    static MAX_SIZE = 10 * 1024 * 1024; // 10MB
    
    static validate(files) {
      return Array.from(files).every(file => 
        file.size <= this.MAX_SIZE && 
        ['image/jpeg', 'image/png'].includes(file.type)
      );
    }
  }