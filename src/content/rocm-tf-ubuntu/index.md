---
title: Setting up your AMD GPU for Tensorflow in Ubuntu (Updated for 20.04)
date: '2020-03-12'
---

If you've been working with **Tensorflow** for some time now and extensively use GPUs/TPUs to speed up your compute intensive tasks, you already know that _Nvidia GPUs_ are your only option to get the job done in a cost effective manner. All you need to have is a _GeForce GPU_ and you can get started crunching numbers in no time. But what about _AMD GPUs_? I mean, it's been some time that the Team Red has hitting back at the Team Green, they should be a viable option for compute intensive tasks like Deep Learning and such, right? The answer is complicated actually. You can, but not without going the extra mile.

### ROCm

I'll keep it brief here since discussing on ROCm isn't the intent of this article and I don't want to open up a large can of worms. In short, ROCm is AMD's answer to Nvidia's **CUDA**. Thanks to this, you can now easily use various GPU dependent computation libraries and software with AMD GPUs which could previously be used with Nvidia GPUs only. You can read more about it [here on their official page](https://rocm.github.io).

### GPU support

Although ROCm opens up new possibilities for AMD GPUs, not all of them can support it. As of now, only Vega, Polaris, Fiji and Hawaii GPUs are supported. Despite being a recent and popular release, Navi wasn't included and nobody knows why! Check the [full list here](https://github.com/RadeonOpenCompute/ROCm#Hardware-and-Software-Support).

For this setup process I'm using a **Radeon VII GPU**.

### OS Support

It's Linux only as of now. Even so, AMD has builds for only **Ubuntu, RHEL and CentOS**. As the title says, I'll be setting up ROCm on Ubuntu.

### Setup

#### ROCm

- Before you begin, make sure to have your system up to date. Run the following commands in Terminal.

```bash
sudo apt update
sudo apt dist-upgrade
```

- Install the dependency `libnuma-dev` for ROCm.

```bash
sudo apt install libnuma-dev
```

- Once `libnuma-dev` gets installed, add the official ROCm repos to `apt`

```bash
wget -qO - http://repo.radeon.com/rocm/apt/debian/rocm.gpg.key | sudo apt-key add -
```

```bash
echo 'deb [arch=amd64] http://repo.radeon.com/rocm/apt/debian/ xenial main' | sudo tee /etc/apt/sources.list.d/rocm.list
```

- Install the ROCm kernel

```bash
	sudo apt update
	sudo apt install rocm-dkms
```

- Add your user to the `VIDEOGROUP`

```bash
sudo usermod -a -G video $LOGNAME
sudo usermod -a -G render $LOGNAME
```

- Open `/etc/adduser.conf` and add these lines

```bash
sudo nano /etc/adduser.conf
```

```bash
ADD_EXTRA_GROUPS=1
EXTRA_GROUPS="render,video"
```

- Open `/etc/udev/rules.d/70-kfd.rules` and add the following

```bash
sudo nano /etc/udev/rules.d/70-kfd.rules
```

```bash
SUBSYSTEM=="kfd", KERNEL=="kfd", TAG+="uaccess", GROUP="video"
```

- Install `libtinfo5`

```bash
sudo apt install libtinfo5
```

- Add ROCm binaries to your path (bash or zsh whichever you use)

```bash
echo 'export PATH=$PATH:/opt/rocm/bin:/opt/rocm/profiler/bin:/opt/rocm/opencl/bin/x86_64' | sudo tee -a /etc/profile.d/rocm.sh
```

- Test if your installation was successful or not. If your installation was successful, you should be able to see the supported GPUs installed on your system in the output.

```bash
sudo /opt/rocm/bin/rocminfo
sudo /opt/rocm/opencl/bin/x86_64/clinfo
```

#### Tensorflow

- Install the dependency packages

```bash
sudo apt install rocm-libs hipcub miopen-hip rccl
```

- Create a `virtualenv` using python. (Use python3)

```bash
# cd into some dir
python3 -m venv ./env

# activate env
source env/bin/activate
```

- Install Tensorflow ROCM

```bash
pip install tensorflow-rocm
```

- You're all done now! Time to test this Tensorflow setup with some python code.

### Testing the setup

Open up your favourite text editor and execute the following python script in the `venv` we created to install Tensorflow.

```python
import tensorflow as tf


x = tf.Variable(3, name="x")
y = tf.Variable(4, name="y")
f = x*x + y*y + 2


tf.print(f)
```

Output should be something like this

```bash
2020-03-12 22:32:31.858480: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library libhip_hcc.so
2020-03-12 22:32:31.909918: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1573] Found device 0 with properties:
pciBusID: 0000:05:00.0 name: Vega 20     ROCm AMD GPU ISA: gfx906
coreClock: 1.801GHz coreCount: 60 deviceMemorySize: 15.98GiB deviceMemoryBandwidth: -1B/s
2020-03-12 22:32:31.948506: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocblas.so
2020-03-12 22:32:31.949600: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library libMIOpen.so
2020-03-12 22:32:31.950580: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocfft.so
2020-03-12 22:32:31.950766: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocrand.so
2020-03-12 22:32:31.950855: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1697] Adding visible gpu devices: 0
2020-03-12 22:32:31.951100: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE3 SSE4.1 SSE4.2 AVX AVX2 FMA
2020-03-12 22:32:31.955707: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 3299240000 Hz
2020-03-12 22:32:31.956437: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x7b95380 initialized for platform Host (this does not guarantee that XLA will be used). Devices:
2020-03-12 22:32:31.956476: I tensorflow/compiler/xla/service/service.cc:176]   StreamExecutor device (0): Host, Default Version
2020-03-12 22:32:31.959003: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1573] Found device 0 with properties:
pciBusID: 0000:05:00.0 name: Vega 20     ROCm AMD GPU ISA: gfx906
coreClock: 1.801GHz coreCount: 60 deviceMemorySize: 15.98GiB deviceMemoryBandwidth: -1B/s
2020-03-12 22:32:31.959067: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocblas.so
2020-03-12 22:32:31.959094: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library libMIOpen.so
2020-03-12 22:32:31.959118: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocfft.so
2020-03-12 22:32:31.959141: I tensorflow/stream_executor/platform/default/dso_loader.cc:44] Successfully opened dynamic library librocrand.so
2020-03-12 22:32:31.959285: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1697] Adding visible gpu devices: 0
2020-03-12 22:32:31.959398: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1096] Device interconnect StreamExecutor with strength 1 edge matrix:
2020-03-12 22:32:31.959421: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1102]      0
2020-03-12 22:32:31.959434: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1115] 0:   N
2020-03-12 22:32:31.959730: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1241] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 15306 MB memory) -> physical GPU (device: 0, name: Vega 20, pci bus id: 0000:05:00.0)
27
```

### Fertig!

That's it! You can now use your AMD GPU with Tensorflow on your Ubuntu installation.
