(StepUp = registerScript({
    name: "StepUp",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

StepUp.registerModule({
    name: "StepUp",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        Mode: Setting.list({
            name: "Mode",
            default: "Vanilla",
            values: [
                "Vanilla",
                "Vulcan",
                //"Watchdog",
            ]
        }),
    },
}, function(module) {
    var Mode = module.settings.Mode.get()

    var tick = 0
    var tick2 = 0
    var airTicks = 0
    var HurtTime = 101
    var ticksCollidedHor = 0
    var oldPosY = plr.posY
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
        oldPosY = plr.posY
    })
    module.on("disable", function(){
        mc.thePlayer.stepHeight = 0.5;
    })

    module.on("update", function() {
        var Mode = module.settings.Mode.get()
        module.tag = Mode

        if (plr.isCollidedHorizontally) {
            ticksCollidedHor ++
        }else{
            ticksCollidedHor = 0
        }
        mc.thePlayer.stepHeight = 0.5;
        if (Mode == "Vanilla") {
            mc.thePlayer.stepHeight = 1;
        }else if (Mode == "Vulcan") {
            if (ticksCollidedHor == 1) {
                mc.thePlayer.jump()
            }else if (wasCollided && ticksCollidedHor == 0){
                mc.thePlayer.motionY = -0.12;
                strafe(0.2)
            }
        }else if (Mode == "Watchdog") {
            if (ticksCollidedHor == 1) {
                mc.thePlayer.motionY = 0.41999998688697815;
            }else if (wasCollided && ticksCollidedHor == 0){
                mc.thePlayer.motionY = 0
            }
        }

        if (plr.isCollidedHorizontally) {
            wasCollided = true;
        } else {
            wasCollided = false;
        }

        if (plr.onGround) {airTicks = 0}else{airTicks ++}
        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        tick++
        tick2++
    })

    module.on("packet", function(eventPacket) {
        var packet = eventPacket.getPacket()

        if (Mode == "Vulcan" && packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook && ticksCollidedHor == 1 && airTicks < 3) {
            packet.y = plr.posY + 0.41999998688697815
        }
    })
})
