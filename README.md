#### Introduction

About a month ago, I decided to learn WebRTC and I struggled with it a lot. During my research,
I noticed that other people struggle with it too so I decided to put into words what
I learned and what challenges did I face. The bad things is that I didn't do any tests. At all. 
I just wanted to make something work and show it and testing Socket.io and WebRTC just got in the
way of it. I also have to switch to antoher project so I don't have time for that now. The idea
of this project is to make a set of reusable Angular components as well as a NodeJS package that anyone can use to make group conference calls within minutes so I will be returning to it in about a month or so. Then I will create the tests. Don't take it againts me. 

My approach in learning anything is to built an application for it. So I built a WebRTC application that
you can find [here](https://caffeworld.goiwouldlike.com). This is by no means an ultimate
tutorial for WebRTC but I will try to write every problem that I had to solve to make it work,
including setting up Socket.io and Apache server in order to work with Web Sockets. 

Starting out, I also did a lot of mistakes from the beginning so I will outline some tips on how you should start and think when building a WebRTC app. Kind of like "things that nobody told me when working with WebRTC". So in the course of this post, I will try to give you some tips so you don't make the same mistakes that I did. 

I will also not go into generalities like exploring WebRTC APIs in depth,the WebRTC specification
(although I did read trough it. You can find it [here](https://www.w3.org/TR/webrtc/)) or the different ways how to create a video call between two peers. There is a lot of noise online about WebRTC and I will
try not to contribute to it. What I will do is present what I did and what worked for me and I will not
go beyond that. But I will share some resources that I read and that helped me to build this.

I order to develop apps with WebRTC you have to have SSL enabled for your application since `getUserMedia`,outside of a secure context so before you start anything, setup SSL. I use Linux 18.04 and Apache and this
guide will have examples for Apache.

So lets start.

#### The simplest of examples

````
// I omitted the entire html document for clarity
<video id="media"></video>

const htmlElement = document.getElementById('media');

return navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
    htmlElement.srcObject = stream;
    }).catch((e) => console.error(e.message)));
````

This is a basic example on how to stream video and audio from your camera into the `video` html element.
The `stream` object is of type `MediaStream`. When you call the method `getUserMedia`, you will be prompted to allow the browser to use your camera and microphone. After that, `then` callback is called and
the `stream:MediaStream` is added to the `srcObject` property of the `htmlElement`. 

If you prefer the `async/await` syntax, you can do it like this

````
try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    htmlElement.srcObject = stream;
} catch (e) {
    console.log(e.message)
}
````

`getUserMedia` accepts a set of [constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) that enable you to control some of the aspects of the stream
displayed in the `video` element. 

## Tip #1

````
WebRTC has a high CPU cost. While I was developing, I also monitored my CPU heat. 
I own a Macbook Pro early 2016 and the CPU temperature raised up to 90 degrees even 
when I had only a local stream of my own camera. 
If you have a weak CPU, I found that setting the lowest possible quality is the best thing while
developing and especially if you have a super cool camera. If you just leave the stream opened, it will
slow down your computer. You would also have to open the browsers developer tools and that will
slow it down even more.

try {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
            width: 240,
            height: 240,
            frameRate: 8
        }
    });
    htmlElement.srcObject = stream;
} catch (e) {
    console.log(e.message);
}
````







