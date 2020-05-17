---
title: Setting up your AMD GPU for Tensorflow in Ubuntu 18.04
date: '2020-03-12'
---

If you've been working with **Tensorflow** for some time now and extensively use GPUs/TPUs to speed up your compute intensive tasks, you already know that _Nvidia GPUs_ are your only option to get the job done in a cost effective manner. All you need to have is a _GeForce GPU_ and you can get started crunching numbers in no time. But what about _AMD GPUs_? I mean, it's been some time that the Team Red has hitting back at the Team Green, they should be a viable option for compute intensive tasks like Deep Learning and such, right? The answer is complicated actually. You can, but not without going the extra mile.

### ROCm

I'll keep it brief here since discussing on ROCm isn't the intent of this article and I don't want to open up a large can of worms. In short, ROCm is AMD's answer to Nvidia's **CUDA**. Thanks to this, you can now easily use various GPU dependent computation libraries and softwares with AMD GPUs which could previously be used with Nvidia GPUs only. You can read more about it [here on their official page](https://rocm.github.io).

### GPU support

Although ROCm opens up new possibilities for AMD GPUs, not all of them can support it. As of now, only Vega, Polaris, Fiji and Hawaii GPUs are supported. Despite being a recent and popular release, Navi wasn't included and nobody knows why! Check the [full list here](https://github.com/RadeonOpenCompute/ROCm#Hardware-and-Software-Support).

For this setup process I'm using a **Radeon VII GPU**.

### OS Support

It's Linux only as of now. Even so, AMD has builds for only **Ubuntu, RHEL and CentOS**. As the title says, I'll be setting up ROCm on Ubuntu 18.04.

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
```

- Add ROCm binaries to your path (bash or zsh whichever you use)

```bash
echo 'export PATH=$PATH:/opt/rocm/bin:/opt/rocm/profiler/bin:/opt/rocm/opencl/bin/x86_64' | sudo tee -a /etc/profile.d/rocm.sh
```

- Test if your installation was successful or not. If your installation was successful, you should be able to see the supported GPUs installed on your system in the output.

```bash
/opt/rocm/bin/rocminfo

# you should see something like this
ROCk module is loaded
shawon is member of video group
=====================
HSA System Attributes
=====================
Runtime Version:         1.1
System Timestamp Freq.:  1000.000000MHz
Sig. Max Wait Duration:  18446744073709551615 (0xFFFFFFFFFFFFFFFF) (timestamp count)
Machine Model:           LARGE
System Endianness:       LITTLE

==========
HSA Agents
==========
*******
Agent 1
*******
  Name:                    Intel(R) Core(TM) i7-5820K CPU @ 3.30GHz
  Marketing Name:          Intel(R) Core(TM) i7-5820K CPU @ 3.30GHz
  Vendor Name:             CPU
  Feature:                 None specified
  Profile:                 FULL_PROFILE
  Float Round Mode:        NEAR
  Max Queue Number:        0(0x0)
  Queue Min Size:          0(0x0)
  Queue Max Size:          0(0x0)
  Queue Type:              MULTI
  Node:                    0
  Device Type:             CPU
  Cache Info:
    L1:                      32768(0x8000) KB
  Chip ID:                 0(0x0)
  Cacheline Size:          64(0x40)
  Max Clock Freq. (MHz):   3600
  BDFID:                   0
  Internal Node ID:        0
  Compute Unit:            12
  SIMDs per CU:            0
  Shader Engines:          0
  Shader Arrs. per Eng.:   0
  WatchPts on Addr. Ranges:1
  Features:                None
  Pool Info:
    Pool 1
      Segment:                 GLOBAL; FLAGS: KERNARG, FINE GRAINED
      Size:                    32805216(0x1f49160) KB
      Allocatable:             TRUE
      Alloc Granule:           4KB
      Alloc Alignment:         4KB
      Acessible by all:        TRUE
    Pool 2
      Segment:                 GLOBAL; FLAGS: COARSE GRAINED
      Size:                    32805216(0x1f49160) KB
      Allocatable:             TRUE
      Alloc Granule:           4KB
      Alloc Alignment:         4KB
      Acessible by all:        TRUE
  ISA Info:
    N/A
*******
Agent 2
*******
  Name:                    gfx906
  Marketing Name:          Vega 20
  Vendor Name:             AMD
  Feature:                 KERNEL_DISPATCH
  Profile:                 BASE_PROFILE
  Float Round Mode:        NEAR
  Max Queue Number:        128(0x80)
  Queue Min Size:          4096(0x1000)
  Queue Max Size:          131072(0x20000)
  Queue Type:              MULTI
  Node:                    1
  Device Type:             GPU
  Cache Info:
    L1:                      16(0x10) KB
  Chip ID:                 26287(0x66af)
  Cacheline Size:          64(0x40)
  Max Clock Freq. (MHz):   1801
  BDFID:                   1280
  Internal Node ID:        1
  Compute Unit:            60
  SIMDs per CU:            4
  Shader Engines:          4
  Shader Arrs. per Eng.:   1
  WatchPts on Addr. Ranges:4
  Features:                KERNEL_DISPATCH
  Fast F16 Operation:      FALSE
  Wavefront Size:          64(0x40)
  Workgroup Max Size:      1024(0x400)
  Workgroup Max Size per Dimension:
    x                        1024(0x400)
    y                        1024(0x400)
    z                        1024(0x400)
  Max Waves Per CU:        40(0x28)
  Max Work-item Per CU:    2560(0xa00)
  Grid Max Size:           4294967295(0xffffffff)
  Grid Max Size per Dimension:
    x                        4294967295(0xffffffff)
    y                        4294967295(0xffffffff)
    z                        4294967295(0xffffffff)
  Max fbarriers/Workgrp:   32
  Pool Info:
    Pool 1
      Segment:                 GLOBAL; FLAGS: COARSE GRAINED
      Size:                    16760832(0xffc000) KB
      Allocatable:             TRUE
      Alloc Granule:           4KB
      Alloc Alignment:         4KB
      Acessible by all:        FALSE
    Pool 2
      Segment:                 GROUP
      Size:                    64(0x40) KB
      Allocatable:             FALSE
      Alloc Granule:           0KB
      Alloc Alignment:         0KB
      Acessible by all:        FALSE
  ISA Info:
    ISA 1
      Name:                    amdgcn-amd-amdhsa--gfx906
      Machine Models:          HSA_MACHINE_MODEL_LARGE
      Profiles:                HSA_PROFILE_BASE
      Default Rounding Mode:   NEAR
      Default Rounding Mode:   NEAR
      Fast f16:                TRUE
      Workgroup Max Size:      1024(0x400)
      Workgroup Max Size per Dimension:
        x                        1024(0x400)
        y                        1024(0x400)
        z                        1024(0x400)
      Grid Max Size:           4294967295(0xffffffff)
      Grid Max Size per Dimension:
        x                        4294967295(0xffffffff)
        y                        4294967295(0xffffffff)
        z                        4294967295(0xffffffff)
      FBarrier Max Size:       32
*** Done ***

```

#### Tensorflow

- Install the dependency packages

```bash
sudo apt install rocm-libs hipcub miopen-hip
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

- You'll require RCCL libs as the recent versions of ROCm tend to exclude them for mysterious reasons.

```bash
sudo apt install rccl
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
